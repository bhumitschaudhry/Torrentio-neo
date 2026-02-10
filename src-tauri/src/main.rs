#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(not(debug_assertions))]
use std::{
    collections::HashSet,
    env,
    fs::OpenOptions,
    io::Write,
    path::PathBuf,
    process::{Command, Stdio},
    time::SystemTime,
};

#[cfg(all(not(debug_assertions), windows))]
use std::os::windows::process::CommandExt;

#[cfg(not(debug_assertions))]
use tauri::Manager;

#[cfg(not(debug_assertions))]
fn startup_log_line(message: &str) {
    let log_path = env::temp_dir().join("torrentio-neo-startup.log");
    let timestamp = format!("{:?}", SystemTime::now());

    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
        let _ = writeln!(file, "[{timestamp}] {message}");
    }
}

#[cfg(not(debug_assertions))]
fn backend_script_candidates(app: &tauri::App) -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    if let Ok(resource_dir) = app.path().resource_dir() {
        candidates.push(resource_dir.join("server").join("index.js"));
    }

    if let Ok(exe_path) = env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            candidates.push(exe_dir.join("resources").join("server").join("index.js"));
            candidates.push(exe_dir.join("server").join("index.js"));
        }
    }

    if let Ok(cwd) = env::current_dir() {
        candidates.push(cwd.join("server").join("index.js"));
    }

    let mut dedup = HashSet::new();
    candidates
        .into_iter()
        .filter(|path| dedup.insert(path.clone()))
        .collect()
}

#[cfg(not(debug_assertions))]
fn node_command_candidates() -> Vec<PathBuf> {
    let mut candidates = vec![PathBuf::from("node")];

    if let Ok(program_files) = env::var("ProgramFiles") {
        candidates.push(PathBuf::from(program_files).join("nodejs").join("node.exe"));
    }

    if let Ok(program_files_x86) = env::var("ProgramFiles(x86)") {
        candidates.push(PathBuf::from(program_files_x86).join("nodejs").join("node.exe"));
    }

    candidates
}

#[cfg(not(debug_assertions))]
fn spawn_backend_process(node_candidate: &PathBuf, script_path: &PathBuf) -> std::io::Result<std::process::Child> {
    let mut command = Command::new(node_candidate);
    command
        .arg(script_path)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null());

    #[cfg(windows)]
    {
        // Prevent a visible console window when launching the bundled Node backend.
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    command.spawn()
}

#[cfg(not(debug_assertions))]
fn start_backend_server(app: &tauri::App) {
    let script_path = backend_script_candidates(app)
        .into_iter()
        .find(|path| path.is_file());

    let Some(script_path) = script_path else {
        startup_log_line("backend startup skipped: server/index.js not found");
        return;
    };

    startup_log_line(&format!(
        "backend script resolved to {}",
        script_path.display()
    ));

    for node_candidate in node_command_candidates() {
        match spawn_backend_process(&node_candidate, &script_path) {
            Ok(child) => {
                startup_log_line(&format!(
                    "backend started via '{}' with pid {}",
                    node_candidate.display(),
                    child.id()
                ));
                return;
            }
            Err(error) => {
                startup_log_line(&format!(
                    "backend start failed via '{}': {error}",
                    node_candidate.display()
                ));
            }
        }
    }

    startup_log_line("backend failed to start with all node candidates");
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(not(debug_assertions))]
            {
                start_backend_server(app);
            }

            #[cfg(debug_assertions)]
            {
                let _ = app;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

