use std::fs;

use chrono::Local;
use image::{ImageBuffer, Rgb};
use ollama_rs::{generation::completion::request::GenerationRequest, Ollama};
use screenshots::Screen;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async  fn screenshot(app: AppHandle, x: i32, y: i32, width: i32, height: i32)->String {
    let screen = Screen::all().unwrap()[0];
    let image = screen
        .capture_area(x as i32, y as i32, width as u32, height as u32)
        .unwrap();
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
    let date = Local::now().format("%Y-%m-%d_%H-%M-%S").to_string();
    let path = app.path().app_data_dir().unwrap();
    if !path.exists() {
        fs::create_dir_all(&path).unwrap();
    }
    let path = path.join("screenshot").join(format!("{}.png", date));
    img.save(&path).unwrap();
    let mut lt = leptess::LepTess::new(None, "eng").unwrap();
    let _ = lt.set_image(path);
    let text = lt.get_utf8_text().unwrap();
    let reponse=ai(text).await;
    println!("{}", reponse);
    reponse
}

async fn ai(question: String) -> String {
    // We are going to use ollama for now
    let ollama = Ollama::default();
    let system = "You are a personal assistant designed to help the user answer questions clearly and independently, without requiring assistance from the user. Provide helpful, accurate, and concise responses.";
    let model = "mistral:latest";
    let request = GenerationRequest::new(model.to_owned(), question).system(system);
    let reponse = ollama.generate(request).await.unwrap().response;
    reponse
}
