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
      "text": "This widget analyzes Requirement and propose new simple, but precise content using INCOSE guidelines. Analysis is done using OpenAI API. To use this widget, follow the steps below:"
    },
    {
      "id": "str005",
      "text": "Set your OpenAI API key in the settings menu in case your admin has not set Company API Key on the server."
    },
    {
      "id": "str006",
      "text": "Open the module or collection and select one text artifact and press analyse."
    },
    {
      "id": "str007",
      "text": "Click the Update Primary Text button to replace proposed content to selected text artifacts. Undo restore original content"
    },
    {
      "id": "str008",
      "text": "Settings:"
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
    },
    {
      "id": "str012",
      "text": "OpenAI API key:"
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


