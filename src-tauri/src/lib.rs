mod screenshot;
use tauri::{
    menu::{MenuBuilder, MenuItem},
    tray::TrayIconBuilder,
    Manager,
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
mod settings;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // .plugin(tauri_plugin_global_shortcut::p)
        .invoke_handler(tauri::generate_handler![screenshot::screenshot])
        .setup(|app| {
            // This For Handling The Tray Icon And the shortcut
            let tray = TrayIconBuilder::new().build(app).unwrap();
            tray.set_icon(Some(app.default_window_icon().unwrap().clone()))
                .unwrap();
            tray.set_tooltip(Some("CaptureAI")).unwrap();
            tray.set_title(Some("CaptureAI")).unwrap();
            let show =
                MenuItem::with_id(app, "screenshot", "screenshot", true, None::<&str>).unwrap();
            let quit = MenuItem::with_id(app, "quit", "quit", true, None::<&str>).unwrap();
            let menu = MenuBuilder::new(app)
                .items(&[&quit, &show])
                .build()
                .unwrap();

            tray.set_menu(Some(menu)).unwrap();
            tray.on_menu_event(move |manager, event| match event.id.as_ref() {
                "quit" => {
                    std::process::exit(0);
                }
                "screenshot" => {
                    if let Some(win) = manager.get_webview_window("test") {
                        win.show().unwrap();
                    }
                }
                _ => {}
            });
            let ctrl_d = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyD);

            // This For the shortcut for open the image
            let _ = app.handle().plugin(
                tauri_plugin_global_shortcut::Builder::new()
                    .with_shortcut("ctrl+d")
                    .unwrap()
                    .with_handler(move |_app, shortcut, event| {
                    if shortcut == &ctrl_d {
                            if let ShortcutState::Pressed = event.state() {
                                let app_handle = _app.app_handle();
                                if let Some(win) = app_handle.get_webview_window("test") {
                                    let _ = win.show();
                                }
                            }
                        }
                    })
                    .build(),
            );
            let _ = app.global_shortcut().register(ctrl_d);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
