
use std::fs;

use chrono::Local;
use image::{ImageBuffer, Rgb};
use screenshots::Screen;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn screenshot(app: AppHandle, x: i32, y: i32, width: i32, height: i32) {
    let screen = Screen::all().unwrap()[0];
    let image = screen.capture_area(x as i32, y as i32, width as u32, height as u32).unwrap();
    let width = image.width();
    let height = image.height();
    let buffer = image.as_raw();
 
  let img = ImageBuffer::from_fn(width as u32, height as u32, |x, y| {
        let i = ((y * width as u32 + x) * 4) as usize;
        let b = buffer[i];
        let g = buffer[i + 1];
        let r = buffer[i + 2];
        Rgb([r, g, b])
    });
    let date=Local::now().format("%Y-%m-%d_%H-%M-%S").to_string();
    let path = app.path().app_data_dir().unwrap();
    if ! path.exists(){
        fs::create_dir_all(&path).unwrap();
    }
    
    img.save(path.join(format!("{}.png",date))).unwrap();
    
}

