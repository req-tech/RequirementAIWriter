let selArt_ref = [];

RM.Event.subscribe(RM.Event.ARTIFACT_SELECTED, onSelection); // Use the RM library to deal with DNG

function onSelection(artifacts) {
    selArt_ref = artifacts;
}

function adjustHeight() { // to recall each time we update the UI
    gadgets.window.adjustHeight();
}

function toggleElementVisibility(elementId, buttonId, displayStrings) {
    let element = document.getElementById(elementId);
    let button = document.getElementById(buttonId);

    if (element.style.display == 'none') {
        element.style.display = "block";
        button.innerHTML = displayStrings[0];
    } else {
        element.style.display = "none";
        button.innerHTML = displayStrings[1];
    }

}

function show_instructions() {
    toggleElementVisibility('instructions_div', 'instructions_button', [getLangString('cs001'), getLangString('cs002')]);
    adjustHeight();
}

function show_settings() {
    toggleElementVisibility('settings_div', 'settings_button', [getLangString('cs003'), getLangString('cs004')]);
    adjustHeight();
}

function setContainerText(containerId, string) {
    document.getElementById(containerId).textContent = string;
}

async function onBodyLoad() {

    // const response = await fetch('js/prompts.json');
    // const prompts = await response.json();
    // alert(prompts);

    const message = document.createElement('h3');
    message.textContent = "AI Results:";
    document.body.appendChild(message);

    const resultText = document.createElement('div');
    resultText.id = 'aiResultText';
    resultText.textContent = "This is where the AI results will be displayed.";
    document.body.appendChild(resultText);

    loadLanguage(); // load the text according to the language file set in main.xml
    adjustHeight();
}

function stripHTML(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// Function to load JSON file
async function loadPrompts() {
    const response = await fetch('js/prompts.json');
    const prompts = await response.json();
    return prompts;
}

// Function to get the prompt
async function getPrompt(cleanText, promptType) {
    const prompts = await loadPrompts();
    const template = prompts[promptType];
    if (template) {
        return template.replace('${cleanText}', cleanText);
    }
    return '';
}

async function callOpenAIAPI(cleanText, promptType) {
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const apiKey = getApiKey();

    if (!apiKey) return;

    const prompt = await getPrompt(cleanText, promptType);
    // const prompt = jsaonPrompt + '<<< '
    console.log(prompt);
    // alert(prompt);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert in requirement analysis and test generation.' },
                    { role: 'user', content: prompt },
                    { role: 'user', content: cleanText }
                ],
                max_tokens: 1000
            }),
        });

        const data = await response.json();
        if (data && data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error('Unexpected API response format:', data);
            return 'Error analyzing the requirement.';
        }
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return 'Error analyzing the requirement.';
    }
}

function getApiKey() {
    if (typeof env === 'undefined' || typeof env.apiKey === 'undefined') {
        env = { apiKey: "" };
    }

    let OpenAIapiKey = "";
    if (env.apiKey) {
        OpenAIapiKey = env.apiKey;
        console.log('Using API key from server.');
    } else {
        const apiKeyEntry = document.cookie.split('; ').find(row => row.startsWith('apiKey='));
        if (apiKeyEntry) {
            const apiKeyValue = apiKeyEntry.split('=')[1].split('|')[0]; // Extract only the API key part
            OpenAIapiKey = apiKeyValue;
            console.log('Using API key from cookie.');
        } else {
            console.log('API key not found in cookie.');
        }
    }
    // Option to read from input field
    if (!OpenAIapiKey) {
        let fieldApiKey = document.getElementById('apiKeyInput').value; 
        
        if (fieldApiKey) {
            OpenAIapiKey = fieldApiKey;
            console.log('Using API key from Field.', OpenAIapiKey);
        }
    }

    if (!OpenAIapiKey) {
        alert('Please enter your OpenAI API key at settings or ask your Admin to add it on server.');
        return;
    }
    return OpenAIapiKey;
}

function saveApiKeyAsCookie() {
    const apiKey = document.getElementById('apiKeyInput').value;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 365); // Set cookie to expire in 365 days
    document.cookie = `apiKey=${apiKey}|${expirationDate.toUTCString()}; path=/;`;

    if (checkCookieExists('apiKey')) {
        console.log('API key cookie has been successfully stored.');
    } else {
        console.log('Failed to store API key cookie.');
    }
}

function removeApiKeyCookie() {
    const message = 'API key cookie has been removed.';
    document.cookie = 'apiKey=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    console.log(message);

    // Update the placeholder of the input field with the name 'apiKeyInput'
    const apiKeyInput = document.getElementById('apiKeyInput');
    if (apiKeyInput) {
        apiKeyInput.placeholder = message;
    }
}

function checkCookieExists(cookieName) {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(cookieName + '='));
    if (cookie) {
        const cookieValue = cookie.split('=')[1];
        const [value, expires] = cookieValue.split('|');
        if (expires) {
            const expirationDate = new Date(expires);
            if (expirationDate > new Date()) {
                return true;
            } else {
                // Cookie is expired, remove it
                document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
                return false;
            }
        } else {
            // No expiration date, assume cookie is valid
            return true;
        }
    }
    return false;
}

async function readArtefact(promptType) {
    if (!selArt_ref || selArt_ref.length === 0) {
        alert('No text artifacts selected.');
        return;
    }

    RM.Data.getAttributes(selArt_ref, [RM.Data.Attributes.PRIMARY_TEXT], async function (res) {
        let primaryText = res.data[0].values["http://www.ibm.com/xmlns/rdm/types/PrimaryText"];
        let cleanText = stripHTML(primaryText);
        document.getElementById('aiResultText').textContent = "Processing...";

        let result = await callOpenAIAPI(cleanText, promptType);
        if (result) {
            let formattedResult = result.replaceAll('¤**', '<br><strong>');
            formattedResult = formattedResult.replaceAll('**', '</strong>');
            formattedResult = formattedResult.replaceAll('¤-', '<br>-');

            document.getElementById('aiResultText').innerHTML = formattedResult;
        } else {
            document.getElementById('aiResultText').textContent = "An error occurred while processing the requirement.";
        }

        adjustHeight();
    });
}