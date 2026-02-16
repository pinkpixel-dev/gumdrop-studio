// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Emitter, Manager, menu::{Menu, MenuItem, Submenu, PredefinedMenuItem}};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Create menu items
            let new_item = MenuItem::with_id(app, "new", "New", true, Some("Ctrl+N"))?;
            let open_item = MenuItem::with_id(app, "open", "Open...", true, Some("Ctrl+O"))?;
            let save_item = MenuItem::with_id(app, "save", "Save", true, Some("Ctrl+S"))?;
            let save_as_item = MenuItem::with_id(app, "save_as", "Save As...", true, Some("Ctrl+Shift+S"))?;
            
            // Export submenu
            let export_png = MenuItem::with_id(app, "export_png", "Export as PNG", true, None::<&str>)?;
            let export_jpg = MenuItem::with_id(app, "export_jpg", "Export as JPG", true, None::<&str>)?;
            let export_svg = MenuItem::with_id(app, "export_svg", "Export as SVG", true, None::<&str>)?;
            let export_json = MenuItem::with_id(app, "export_json", "Export as JSON", true, None::<&str>)?;
            let export_html = MenuItem::with_id(app, "export_html", "Export as HTML", true, None::<&str>)?;
            
            let export_submenu = Submenu::with_items(
                app,
                "Export",
                true,
                &[&export_png, &export_jpg, &export_svg, &export_json, &export_html],
            )?;
            
            let quit_item = PredefinedMenuItem::quit(app, Some("Quit"))?;
            
            let file_menu = Submenu::with_items(
                app,
                "File",
                true,
                &[
                    &new_item,
                    &open_item,
                    &PredefinedMenuItem::separator(app)?,
                    &save_item,
                    &save_as_item,
                    &PredefinedMenuItem::separator(app)?,
                    &export_submenu,
                    &PredefinedMenuItem::separator(app)?,
                    &quit_item,
                ],
            )?;
            
            // Edit menu
            let undo_item = MenuItem::with_id(app, "undo", "Undo", true, Some("Ctrl+Z"))?;
            let redo_item = MenuItem::with_id(app, "redo", "Redo", true, Some("Ctrl+Shift+Z"))?;
            
            let edit_menu = Submenu::with_items(
                app,
                "Edit",
                true,
                &[&undo_item, &redo_item],
            )?;
            
            // View menu
            let zoom_in = MenuItem::with_id(app, "zoom_in", "Zoom In", true, Some("+"))?;
            let zoom_out = MenuItem::with_id(app, "zoom_out", "Zoom Out", true, Some("-"))?;
            let toggle_grid = MenuItem::with_id(app, "toggle_grid", "Toggle Grid", true, Some("Ctrl+G"))?;
            let toggle_dark = MenuItem::with_id(app, "toggle_dark", "Toggle Dark Mode", true, Some("Ctrl+D"))?;
            
            let view_menu = Submenu::with_items(
                app,
                "View",
                true,
                &[&zoom_in, &zoom_out, &PredefinedMenuItem::separator(app)?, &toggle_grid, &toggle_dark],
            )?;
            
            // Help menu
            let about_item = MenuItem::with_id(app, "about", "About Gumdrop Studio", true, None::<&str>)?;
            let website_item = MenuItem::with_id(app, "website", "Visit Website", true, None::<&str>)?;
            
            let help_menu = Submenu::with_items(
                app,
                "Help",
                true,
                &[&about_item, &website_item],
            )?;
            
            // Build and set menu
            let menu = Menu::with_items(app, &[&file_menu, &edit_menu, &view_menu, &help_menu])?;
            app.set_menu(menu)?;
            
            // Handle menu events
            app.on_menu_event(|app, event| {
                let window = app.get_webview_window("main").unwrap();
                
                match event.id().as_ref() {
                    "new" => { let _ = window.emit("menu:new", ()); }
                    "open" => { let _ = window.emit("menu:open", ()); }
                    "save" => { let _ = window.emit("menu:save", ()); }
                    "save_as" => { let _ = window.emit("menu:save_as", ()); }
                    "export_png" => { let _ = window.emit("menu:export", "png"); }
                    "export_jpg" => { let _ = window.emit("menu:export", "jpg"); }
                    "export_svg" => { let _ = window.emit("menu:export", "svg"); }
                    "export_json" => { let _ = window.emit("menu:export", "json"); }
                    "export_html" => { let _ = window.emit("menu:export", "html"); }
                    "undo" => { let _ = window.emit("menu:undo", ()); }
                    "redo" => { let _ = window.emit("menu:redo", ()); }
                    "zoom_in" => { let _ = window.emit("menu:zoom_in", ()); }
                    "zoom_out" => { let _ = window.emit("menu:zoom_out", ()); }
                    "toggle_grid" => { let _ = window.emit("menu:toggle_grid", ()); }
                    "toggle_dark" => { let _ = window.emit("menu:toggle_dark", ()); }
                    "about" => {
                        use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
                        let _ = app.dialog()
                            .message("Gumdrop Studio v1.0.0\n\nA fun pixel art creation app with dual-layer canvas.\n\nMade with ❤️ by Pink Pixel\nhttps://pinkpixel.dev")
                            .kind(MessageDialogKind::Info)
                            .title("About Gumdrop Studio")
                            .blocking_show();
                    }
                    "website" => {
                        use tauri_plugin_shell::ShellExt;
                        let _ = app.shell().open("https://pinkpixel.dev", None);
                    }
                    _ => {}
                }
            });
            
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
