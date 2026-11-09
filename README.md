# Study RAG

A study assistant that extracts text from notes, retrieves relevant passages, and uses them to answer questions or create MCQs, theory questions, numerical practice, and revision priorities. Responses include source references so you can check them against your notes.

## Download the project

1. Open the [GitHub repository](https://github.com/manish2049/rag-chatbot). If it is private, sign in with an account that has access.
2. Click the green **Code** button, then select **Download ZIP**.
3. Find the ZIP in your Downloads folder and extract it: on Windows, right-click it and select **Extract All**; on macOS, double-click it.
4. Open the extracted project folder containing `app.py` and `requirements.txt`. Run the setup commands below from this folder. On Windows, you can click the folder's address bar, type `powershell`, and press Enter to open PowerShell there.

## Run locally

1. Install Python 3.10 or later and, for images and scanned PDFs, [Tesseract OCR](https://tesseract-ocr.github.io/tessdoc/Installation.html). Make sure the `tesseract` command is on your PATH. Selectable text in PDFs works without Tesseract.
2. Install the dependencies from the project folder. In Windows PowerShell:

   ```powershell
   python -m pip install -r requirements.txt
   ```

   On macOS or Linux, use `python3 -m pip install -r requirements.txt`.

3. Choose an AI provider and set its environment variables in the same terminal. For Gemini, create your own API key in [Google AI Studio](https://aistudio.google.com/app/apikey). In Windows PowerShell:

   ```powershell
   $env:OPENAI_API_KEY="YOUR_GEMINI_API_KEY"
   $env:OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
   $env:OPENAI_MODEL="gemini-3.5-flash-lite"
   ```

   On macOS or Linux, use:

   ```sh
   export OPENAI_API_KEY="YOUR_GEMINI_API_KEY"
   export OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
   export OPENAI_MODEL="gemini-3.5-flash-lite"
   ```

   Replace `YOUR_GEMINI_API_KEY` with your own key. Keep it private: never commit it to GitHub or share it in screenshots. Gemini model availability and usage limits depend on your account; use another available model if this one is unavailable or busy.

4. Start the app in the same terminal:

   ```sh
   python -m uvicorn app:app --reload
   ```

   On macOS or Linux, use `python3` if needed. Keep the terminal open and visit <http://127.0.0.1:8000>. To stop the server, press Ctrl+C. In a new terminal, set the provider variables again before restarting the app.

For OpenAI instead, set `OPENAI_API_KEY` to your OpenAI key, leave `OPENAI_BASE_URL` unset for the default OpenAI endpoint, and optionally set `OPENAI_MODEL` (default `gpt-4o-mini`).

`OPENAI_MODEL` optionally changes the model (default `gpt-4o-mini`); `OPENAI_BASE_URL` optionally changes the API base URL (default `https://api.openai.com/v1`). Requests send retrieved excerpts and recent conversation messages to the configured model provider. Without a key, the app displays relevant excerpts and a setup notice instead of generating questions.

## Use and limitations

Upload PDF, PNG, JPEG, or WEBP notes, then select a question type or ask about the material. Upload up to 10 files at a time, each up to 20 MB; PDFs may have up to 80 pages, and the server holds up to 30 documents. Password-protected PDFs are unsupported. Documents are held in memory and disappear when the server restarts.

OCR quality depends on image clarity and Tesseract's installed language data. Retrieval uses keyword matching, so relevant material can be missed. Generated questions, answers, numerical solutions, and topic priorities can be wrong; check them against the source and your syllabus. Topic priorities are suggestions, not predictions of an actual exam. This local app has no user accounts or access controls and is not intended for public deployment as-is.
