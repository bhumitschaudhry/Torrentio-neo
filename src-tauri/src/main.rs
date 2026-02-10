#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(not(debug_assertions))]
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(not(debug_assertions))]
            {
                use std::process::Command;

                if let Ok(resource_dir) = app.path().resource_dir() {
                    let server_script = resource_dir.join("server").join("index.js");
                    if server_script.exists() {
                        if let Err(error) = Command::new("node").arg(server_script).spawn() {
                            eprintln!("failed to start backend server: {error}");
                        }
                    }
                }
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
