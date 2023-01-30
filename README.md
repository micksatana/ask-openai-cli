# Ask OpenAI CLI

Command-line interface for interacting with OpenAI.

## Installation

```
npm i -g ask-openai-cli@latest
```

## Usages

Override model, temperature, and max tokens options

```
ask "Something" --model ada --temperature 1 --max-tokens 10
```

With shorthand,

```
ask "Something" -m ada -T 1 -t 10
```

Default is based on `.env`, later we will have `--init` option to handle the `.env` file generation.

```
ask "Something"
```

Without double quotes, it'll auto join `command.args` with spaces,

```
ask Something is going on, innit?
```

Getting version info,

```
ask -V
```

or

```
ask --version
```

Getting help info,

```
ask --help
```

## Default options

Default model is `text-davinci-003`.

Default max tokens is `100`.

Default temperature is `0.5`.

## Configuration

Run with init option, it will help generate `<Home Directory>/.ask-openai-cli/.env` which is used as the main configuration file for the CLI.

```
ask --init
```
