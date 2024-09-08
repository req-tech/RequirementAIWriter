let selArt_ref = [],
    backup = [],
    selectedArtifacts = [];
let attributes = ["font-family:", " font-size:", " background-color:", " font-style:", " font-variant-orphans:", " font-variant-caps:", " font-variant-ligatures:", " text-align:", " text-decoration-thickness:", " text-indent:", " text-transform:", " white-space:", " word-spacing:", " letter-spacing:", " orphans:", " -webkit-text-stroke-width:", " widows:", " text-decoration-style:"];
let formatTags = ["small", "big"];

function adjustHeight() {
    gadgets.window.adjustHeight();
}

function onBodyLoad() {
    loadLanguage();
    document.getElementById('button1').disabled = false;
    let local = localStorage.getItem('FormatResetSettings');
    if (local != null) {
        let settings = local.split(',');
        let checkboxes = document.getElementsByName('checkbox');
        for (let i = 0; i < checkboxes.length; i++)
            checkboxes[i].checked = (settings[i] == 'true');
        editSettings();
    }
    var ro = new ResizeObserver(entries => {
        adjustHeight();
    });
    ro.observe(document.getElementById('button1'));
    adjustHeight();
}

function show_instructions() {
    let instructions_div = document.getElementById('instructions_div');
    let instructions_button = document.getElementById('instructions_button');
    if (instructions_div.style.display == 'none') {
        instructions_div.style.display = "block";
        instructions_button.innerHTML = getLangString('cs001');
    } else {
        instructions_div.style.display = "none";
        instructions_button.innerHTML = getLangString('cs002');
    }
    adjustHeight();
}

function show_settings() {
    let settings_div = document.getElementById('settings_div');
    let settings_button = document.getElementById('settings_button');
    if (settings_div.style.display == 'none') {
        settings_div.style.display = "block";
        settings_button.innerHTML = getLangString('cs003');
    } else {
        settings_div.style.display = "none";
        settings_button.innerHTML = getLangString('cs004');
    }
    adjustHeight();
}

function select_all() {
    var checkboxes = document.getElementsByName('checkbox');
    for (let i = 0; i < checkboxes.length; i++)
        checkboxes[i].checked = true;
    editSettings();
}

function deselect_all() {
    var checkboxes = document.getElementsByName('checkbox');
    for (let i = 0; i < checkboxes.length; i++)
        checkboxes[i].checked = false;
    editSettings();
}

function editSettings() {
    var checkboxes_values = Array.from(document.getElementsByName('checkbox')).map(function(a) {
        return a.checked;
    });
    if (checkboxes_values.reduce((pv, cv) => pv + cv, 0) == 0)
        document.getElementById("button1").disabled = true;
    else
        document.getElementById("button1").disabled = false;
    attributes = [];
    formatTags = [];
    settings_summary = '';
    localStorage.setItem('FormatResetSettings', checkboxes_values.toString());
    if (checkboxes_values[0]) {
        formatTags = formatTags.concat(['b', 'strong']);
        if (settings_summary == '')
            settings_summary += getLangString('cs005');
        else
            settings_summary += (', ' + getLangString('cs005'));
    }
    if (checkboxes_values[1]) {
        formatTags = formatTags.concat(['i', 'em']);
        if (settings_summary == '')
            settings_summary += getLangString('cs006');
        else
            settings_summary += (', ' + getLangString('cs006'));
    }
    if (checkboxes_values[2]) {
        formatTags = formatTags.concat(['del']);
        if (settings_summary == '')
            settings_summary += getLangString('cs007');
        else
            settings_summary += (', ' + getLangString('cs007'));
    }
    if (checkboxes_values[3]) {
        formatTags = formatTags.concat(['ins', 'u']);
        if (settings_summary == '')
            settings_summary += getLangString('cs008');
        else
            settings_summary += (', ' + getLangString('cs008'));
    }
    if (checkboxes_values[4]) {
        attributes = attributes.concat([" font-family:", " font-style:", " font-variant-orphans:", " font-variant-caps:", " font-variant-ligatures:", " text-transform:", " white-space:", " word-spacing:", " font-weight:", " letter-spacing:", " orphans:", " -webkit-text-stroke-width:", " widows:", " text-decoration-style:"]);
        if (settings_summary == '')
            settings_summary += getLangString('cs009');
        else
            settings_summary += (', ' + getLangString('cs009'));
    }
    if (checkboxes_values[5]) {
        formatTags = formatTags.concat(['small', 'big']);
        attributes = attributes.concat([" font-size:"]);
        if (settings_summary == '')
            settings_summary += getLangString('cs010');
        else
            settings_summary += (', ' + getLangString('cs010'));
    }
    if (checkboxes_values[6]) {
        formatTags = formatTags.concat(['sub']);
        if (settings_summary == '')
            settings_summary += getLangString('cs011');
        else
            settings_summary += (', ' + getLangString('cs011'));
    }
    if (checkboxes_values[7]) {
        formatTags = formatTags.concat(['sup']);
        if (settings_summary == '')
            settings_summary += getLangString('cs012');
        else
            settings_summary += (', ' + getLangString('cs012'));
    }
    if (checkboxes_values[8]) {
        attributes = attributes.concat([" text-align:", " text-indent:", " white-space:", " word-spacing:", " letter-spacing:"]);
        if (settings_summary == '')
            settings_summary += getLangString('cs013');
        else
            settings_summary += (', ' + getLangString('cs013'));
    }
    if (checkboxes_values[9]) {
        attributes = attributes.concat([" color:", " text-decoration-color:"]);
        if (settings_summary == '')
            settings_summary += getLangString('cs014');
        else
            settings_summary += (', ' + getLangString('cs014'));
    }
    if (checkboxes_values[10]) {
        formatTags = formatTags.concat(['mark']);
        attributes = attributes.concat([" background-color:", " background:"]);
        if (settings_summary == '')
            settings_summary += getLangString('cs015');
        else
            settings_summary += (', ' + getLangString('cs015'));
    }
    if (settings_summary == '')
        settings_summary = getLangString('cs016');
    else
        settings_summary = getLangString('cs017') + " " + settings_summary + '.';
    document.getElementById('settings_summary').innerHTML = settings_summary;
    adjustHeight();
}

function outputArray(item, trimmedText) {
    item.values["http://www.ibm.com/xmlns/rdm/types/PrimaryText"] = trimmedText;
    return item;
}

function removeAttributes(tagCode, startString, endString) {
    let startIndex = tagCode.indexOf(startString);
    if (startIndex == -1)
        return tagCode;
    let endIndex = tagCode.indexOf(endString, startIndex + startString.length);
    if (endIndex == -1)
        return tagCode;
    let styleCode = " " + tagCode.substring(startIndex + startString.length, endIndex);
    if (styleCode == " ")
        return tagCode.substring(0, startIndex) + tagCode.substring(endIndex + endString.length);
    if (styleCode.slice(-1) != ";")
        styleCode += ";";
    attributes.forEach((attribute) => {
        let startIndex_attr = styleCode.indexOf(attribute);
        if (startIndex_attr != -1) {
            let endIndex_attr = styleCode.indexOf(";", startIndex_attr);
            styleCode = styleCode.substr(0, startIndex_attr) + styleCode.substr(endIndex_attr + 1);
        }
    });
    if (styleCode == "")
        return tagCode.substring(0, startIndex) + tagCode.substring(endIndex + endString.length);
    return tagCode.substring(0, startIndex) + 'style="' + styleCode.substring(1) + '"' + tagCode.substring(endIndex + endString.length);
}

function removeStyle(primaryText) {
    let pT = primaryText;
    let startIndex = pT.indexOf("<");
    if (startIndex == -1)
        return pT;
    let endIndex = pT.indexOf(">", startIndex);
    if (endIndex == -1)
        return pT;
    let tagCode = pT.substring(startIndex, endIndex + 1);
    tagCode = removeAttributes(tagCode, 'style="', '" ');
    tagCode = removeAttributes(tagCode, "style='", "' ");
    return pT.substring(0, startIndex) + tagCode + removeStyle(pT.substring(endIndex + 1));
}

function removeFormattation(primaryText) {
    formatTags.forEach((formatTag) => {
        primaryText = primaryText.replaceAll("<" + formatTag + ">", "<span>");
        primaryText = primaryText.replaceAll("<" + formatTag + " ", "<span ");
        primaryText = primaryText.replaceAll("</" + formatTag + ">", "</span>");
    });
    primaryText = primaryText.replaceAll("style = ", "style=");
    primaryText = primaryText.replaceAll("style =", "style=");
    primaryText = primaryText.replaceAll("style= ", "style=");
    primaryText = primaryText.replaceAll('">', '" >');
    primaryText = primaryText.replaceAll("'>'", "' >");
    return removeStyle(primaryText);
}

function print_errors_ids(error_ref) {
    if (error_ref.length == 0)
        return;
    RM.Data.getAttributes(error_ref, function(opResult) {
        if (opResult.code == RM.OperationResult.OPERATION_OK) {
            error_string = "";
            for (let i = 0; i < opResult.data.length; i++)
                error_string = error_string + ", " + opResult.data[i].values['http://purl.org/dc/terms/identifier']
            var wC = document.getElementById("warnings_container");
            wC.innerHTML = wC.innerHTML + "<b>" + getLangString("cs021") + " " + error_string.substring(2) + ".</b><br/>";
            adjustHeight();
        }
    });
}

function clearFormats() {
    if (selArt_ref == undefined || selArt_ref.length == 0) {
        alert('No text artifacts selected.');
        return;
    }
    backup = [];
    let button = document.getElementById("button1");
    let button_all = document.getElementById("button1_all");
    button.innerHTML = getLangString('cs018');
    button.disabled = true;
    button_all.disabled = true;
    RM.Data.getAttributes(selArt_ref, [RM.Data.Attributes.PRIMARY_TEXT, 'http://www.ibm.com/xmlns/rdm/types/ArtifactFormat'], function(res) {
        formatReset_click(res)
    });
}

function clearFormats_all() {
    backup = [];
    let button = document.getElementById("button1");
    let button_all = document.getElementById("button1_all");
    button.innerHTML = getLangString('cs018');
    button.disabled = true;
    button_all.disabled = true;
    RM.Client.getCurrentArtifact(function(response) {
        if (response.code === RM.OperationResult.OPERATION_OK) {
            if (response.data.values[RM.Data.Attributes.FORMAT] === "Module")
                RM.Data.getContentsAttributes(response.data.ref, [RM.Data.Attributes.PRIMARY_TEXT, 'http://www.ibm.com/xmlns/rdm/types/ArtifactFormat'], function(res) {
                    formatReset_click(res)
                });
            else {
                button.disabled = false;
                button_all.disabled = false;
                button.innerHTML = getLangString('cs019');
                alert('You are not in a Module.');
            }
        } else {
            button.disabled = false;
            button_all.disabled = false;
            button.innerHTML = getLangString('cs019');
            alert('Error.');
        }
    });
}

function formatReset_click(res) {
    let button = document.getElementById("button1");
    let button_all = document.getElementById("button1_all");
    if (res.code === RM.OperationResult.OPERATION_OK) {
        for (let i = res.data.length - 1; i > -1; i--)
            if (res.data[i].values['http://www.ibm.com/xmlns/rdm/types/ArtifactFormat'] != 'Text')
                res.data.splice(i, 1);
        selectedArtifacts = res;
        if (res.data.length == 0) {
            alert('There are no text artifacts to format.');
            button.disabled = false;
            button_all.disabled = false;
            button.innerHTML = getLangString('cs019');
            return;
        }
        toSave = [];
        for (let i = 0; i < res.data.length; i++) {
            let primaryText = res.data[i].values["http://www.ibm.com/xmlns/rdm/types/PrimaryText"];
            backup.push(primaryText);
            if (primaryText != null) {
                let nonFormattedText = removeFormattation(primaryText);
                toSave.push(outputArray(res.data[i], nonFormattedText));
            }
        }
        error_ref = [];
        if (toSave.length > 0) {
            RM.Data.setAttributes(toSave, function(result) {
                warnings = "<ul>";
                for (let i = 0; i < result.data.length; i++)
                    if (result.data[i].code != RM.OperationResult.OPERATION_OK)
                        if (result.data[i].message != null) {
                            let message = result.data[i].message;
                            if (typeof message == 'number')
                                warnings += ("<li>Error " + message.toString() + "</li>");
                            else
                                warnings += ("<li>" + message + "</li>");
                            error_ref.push(result.data[i].data);
                        }
                if (warnings == "<ul>") {
                    warnings = "";
                    document.getElementById("str031").hidden = true;
                    document.getElementById("str032").hidden = false;
                } else {
                    warnings += "</ul>";
                    document.getElementById("str031").hidden = false;
                    document.getElementById("str032").hidden = true;
                }
                document.getElementById("warnings_container").innerHTML = warnings;
                print_errors_ids(error_ref);
                button.disabled = false;
                button_all.disabled = false;
                button.innerHTML = getLangString('cs019');
                document.getElementById("button2").style.display = "block";
                adjustHeight();
            });
        } else {
            button.disabled = false;
            button_all.disabled = false;
            button.innerHTML = getLangString('cs019');
        }
    } else {
        button.disabled = false;
        button_all.disabled = false;
        button.innerHTML = getLangString('cs019');
        alert('Error.');
    }
}

function undo_clearFormats() {
    let button = document.getElementById("button1");
    let button_all = document.getElementById("button1_all");
    button.disabled = true;
    button_all.disabled = true;
    let button2 = document.getElementById("button2");
    button2.innerHTML = getLangString('cs018');
    button2.disabled = true;
    res = selectedArtifacts;
    let toSave = [];
    for (let i = 0; i < res.data.length; i++)
        toSave.push(outputArray(res.data[i], backup[i]));
    RM.Data.setAttributes(toSave, function(result) {
        button2.innerHTML = getLangString('cs020');
        button2.disabled = false;
        button.disabled = false;
        button_all.disabled = false;
        document.getElementById("warnings_container").innerHTML = "";
        document.getElementById("str031").hidden = true;
        document.getElementById("str032").hidden = true;
        if (result.code === RM.OperationResult.OPERATION_OK) {
            button2.style.display = "none";
            backup = [];
        }
        adjustHeight();
    });
}

function onSelection(artifacts) {
    button2 = document.getElementById("button2");
    if (button2.style.display != "none") {
        document.getElementById("button2").style.display = "none";
        backup = [];
        document.getElementById("warnings_container").innerHTML = "";
        document.getElementById("str031").hidden = true;
        document.getElementById("str032").hidden = true;
        adjustHeight();
    }
    selArt_ref = artifacts;
}
RM.Event.subscribe(RM.Event.ARTIFACT_SELECTED, onSelection);