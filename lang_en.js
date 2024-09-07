lang_json = `{
  "strings": [
    {
      "id": "str001",
      "text": "Show instructions"
    },
    {
      "id": "str002",
      "text": "Change settings"
    },
    {
      "id": "str003",
      "text": "How to use this widget?"
    },
    {
      "id": "str004",
      "text": "This widget is designed to be a template for new Celeris widgets. It contains most of the basic code you might need to develop a widget. Follow the instructions below to use this widget with ease and confidence."
    },
    {
      "id": "str005",
      "text": "Open the module."
    },
    {
      "id": "str006",
      "text": "Select the text artifacts."
    },
    {
      "id": "str007",
      "text": "Click the button to print the title of the selected text artifacts."
    },
    {
      "id": "str008",
      "text": "Settings: "
    },
    {
      "id": "str009",
      "text": "This is a settings menu prototype. If you need a settings menu, you can use it. Otherwise, you should remove it."
    },
    {
      "id": "str010",
      "text": "Title(s):"
    },
    {
      "id": "str011",
      "text": "Print Text Artifacts Titles"
    }
  ],
  "codeStrings":
      {
          "cs001": "Hide instructions",
          "cs002": "Show instructions",
          "cs003": "Hide settings",
          "cs004": "Change settings"
      }
}`;

lang = JSON.parse(lang_json);

function loadLanguage()
{
    for (i = 0; i < lang.strings.length; i++) 
    {
        span = document.getElementById(lang.strings[i].id);
        if(span != null)
            span.textContent = lang.strings[i].text;
    }
}

function getLangString(id)
{
    return lang.codeStrings[id];
}


