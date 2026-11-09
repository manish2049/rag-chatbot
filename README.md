# Study RAG

Turn PDF notes and images into study material: ask questions, generate MCQs, theory and numerical questions, and find important topics. The app retrieves relevant passages from your notes and sends them to an AI model to help create answers.

## Run it on Windows: step by step

### 1. Download and extract the project

1. Open [this GitHub repository](https://github.com/manish2049/rag-chatbot).
2. Click the green **Code** button and choose **Download ZIP**.
3. Open your Downloads folder, right-click the downloaded ZIP, and choose **Extract All**. Choose a location and click **Extract**.
4. Open the extracted folder. If there is another folder inside it, open that too, until you see **app.py**, **requirements.txt**, and the **public** folder.

### 2. Open PowerShell in the project folder

In the folder containing **app.py**, click the address bar at the top of File Explorer, type `powershell`, and press **Enter**. A PowerShell window opens in that folder.

Check that Python is installed:

```powershell
python --version
```

If you see a version number, continue. If Python is not found, install Python 3.10 or newer from [python.org](https://www.python.org/downloads/) and select **Add Python to PATH** during installation. Then close and reopen PowerShell in the project folder and check again.

### 3. Install the dependencies

In the same PowerShell window, run:

```powershell
python -m pip install -r requirements.txt
```

Wait for the installation to finish before continuing. You generally need to do this only once unless the dependencies change.

### 4. Get a Gemini API key

1. Open [Google AI Studio](https://aistudio.google.com/app/apikey) and sign in.
2. Create an API key and copy it.

Keep your key private. Do not commit it to GitHub, share it with anyone, or paste it into a public screenshot.

### 5. Configure the AI model

In the **same PowerShell window**, enter the following commands one at a time. Replace `YOUR_GEMINI_API_KEY` with your actual key, keeping the quotation marks:

```powershell
$env:OPENAI_API_KEY="YOUR_GEMINI_API_KEY"
$env:OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
$env:OPENAI_MODEL="gemini-3.5-flash-lite"
```

The variables are named `OPENAI_...` because the app uses an OpenAI-compatible API; the settings above connect it to Gemini. Model availability and usage limits depend on your Google account. If this model is unavailable or busy, choose another text model available to your account and change the last command.

### 6. Start the app

In the same PowerShell window, enter:

```powershell
python -m uvicorn app:app --reload
```

When you see **Uvicorn running on http://127.0.0.1:8000**, open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser. Leave PowerShell open while you use the app.

Upload your notes, choose a practice type or ask a question, and check the source references alongside the answer. To stop the server, return to PowerShell and press **Ctrl+C**.

### 7. Open it again later

1. Open PowerShell in the project folder as described in step 2.
2. Enter the three Gemini commands from step 5 again. They last only for that PowerShell session.
3. Run `python -m uvicorn app:app --reload` and open [http://127.0.0.1:8000](http://127.0.0.1:8000).
4. Upload your notes again. Documents are kept in memory and are lost when the server stops.

### Images and scanned PDFs

To read text from images and scanned PDF pages, install [Tesseract OCR](https://tesseract-ocr.github.io/tessdoc/Installation.html) and make sure the `tesseract` command is on your PATH. Restart PowerShell after installation. PDFs with selectable text work without Tesseract. OCR results depend on image clarity and the installed language data.

### Troubleshooting

- **Could not import module "app":** Stop the server with Ctrl+C. Open PowerShell in the folder containing `app.py`, then start it again.
- **The site can't be reached:** Make sure Uvicorn is running and the PowerShell window is still open. Use the address printed by Uvicorn.
- **The language model could not respond:** Check the API key, base URL, model name, internet connection, and provider usage limits. If the provider reports high demand, try again later or select another available text model.
- **No questions are generated without a key:** Without a configured model, the app shows relevant passages and a setup notice instead.

## macOS and Linux

Download and extract the project as described above. Open Terminal, change into the folder containing `app.py`, and run the following commands. Install Python 3.10 or newer first if needed.

```sh
python3 -m pip install -r requirements.txt
export OPENAI_API_KEY="YOUR_GEMINI_API_KEY"
export OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
export OPENAI_MODEL="gemini-3.5-flash-lite"
python3 -m uvicorn app:app --reload
```

Replace the placeholder with your Gemini key, keep the terminal open, and visit [http://127.0.0.1:8000](http://127.0.0.1:8000). Set the variables again in each new terminal session. Tesseract is needed for images and scanned PDFs.

## Other providers and limitations

For OpenAI instead, set `OPENAI_API_KEY` to your OpenAI key, leave `OPENAI_BASE_URL` unset for the default OpenAI endpoint, and optionally set `OPENAI_MODEL` (default `gpt-4o-mini`). Retrieved excerpts and recent conversation messages are sent to the configured model provider.

Upload PDF, PNG, JPEG, or WEBP files: up to 10 files at a time, each up to 20 MB. PDFs may have up to 80 pages, and the server holds up to 30 documents. Password-protected PDFs are unsupported.

Retrieval uses keyword matching, so relevant material can be missed. Generated questions, answers, numerical solutions, and topic priorities can be wrong; check them against the sources and your syllabus. Topic priorities are suggestions, not predictions of an actual exam. This local app has no user accounts or access controls and is not intended for public deployment as-is.
