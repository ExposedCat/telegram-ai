# Telegram AI

Empower your Telegram Messenger experience with Large Language AI Models

## Running
- Install Deno:
```bash
curl -fsSL https://deno.land/install.sh | sh
```
- Install ollama (can take some time)
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
- Pull model (can take some time too)
```bash
ollama pull llama3.1
```
- Install dependencies:
```bash
deno install
```
- Create application [here](https://my.telegram.org/apps)
- Copy and fill ENV file:
```bash
cp .env.example .env
```
- Run and follow instructions in the terminal:
```bash
deno task start
```
