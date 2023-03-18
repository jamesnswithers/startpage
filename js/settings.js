/**
 * File to handle editing the settings from the menu itself.
 * 
 * A modal will be shown where the user can edit settings
 * and finally when submitted, the settings will be written to
 * the config.json and this config is read each time the page
 * loads.
 */

modalId = "settings"
closeId = "close"
saveButtonId = "saveAndClose"
reloadButtonId = "reload"
jsonContainer = "jsoneditor"
localUserSettingsStore = "userSettingsStore"


function showSettings() {
    modalEl = document.getElementById(modalId)
    closeBtn = document.getElementsByClassName(closeId)[0]
    modalEl.style.display = "block"

    // Define the jsonEditor
    container = document.getElementById(jsonContainer)
    const options = {
        mode: 'tree',
        modes: ['code', 'tree', 'view']
    }
    const editor = new JSONEditor(container, options)
    loadJson(editor)

    closeBtn.onclick = () => {
        hideSettings(editor);
    }

    settingsCogElement = document.getElementById("settings-cog");
    // Add an onclick listener to hide settings if the button is clicked
    // again.
    settingsCogElement.onclick = () => {
        hideSettings(editor);
    }

    document.getElementById(saveButtonId).onclick = () => {
        saveAndHideSettings(editor);
    }

    document.getElementById(reloadButtonId).onclick = async () => {
        deleteCachedSettings();
        await fetchSettings();
        loadJson(editor);
    }

    return editor;
}

function hideSettings() {
    /**
     * Hide the settings.
     * 
     * This function is to be called when the settings window
     * is supposed to be hidden, This will automatically
     * handle saving the updated settings to the localstorage.
     */
    modalEl.style.display = "none"
    // Get the updated JSON
    //updatedJson = editor.get();
    document.getElementById(jsonContainer).innerHTML = ""
    //location.reload()
    //saveSettings(updatedJson);

    settingsCogElement = document.getElementById("settings-cog");
    // Add event listener
    settingsCogElement.onclick = function() {
        editor = showSettings();
    }
}

function saveAndHideSettings(editor) {
    saveSettings(editor.get());
    hideSettings();
}

async function fetchSettings() {
    existingSettings = localStorage.getItem(localUserSettingsStore);
    if (existingSettings == null) {
        const response = await fetch(window.location + "/config.json");
        result = await response.json();
        await saveSettings(result);
    } else {
        result = JSON.parse(existingSettings).data
    }
    return result;
};

function deleteCachedSettings() {
    console.log("Removing settings");
    localStorage.removeItem(localUserSettingsStore);
    console.log("Settings removed");
}

async function saveSettings(settings) {
    console.log("Saving settings");
    jsonSettings = {"data": settings, "time": new Date()}
    stringyJsonSettings = JSON.stringify(jsonSettings)
    localStorage.setItem(localUserSettingsStore, stringyJsonSettings);
    console.log(jsonSettings);
}

async function loadJson(editor) {
    userSettings = JSON.parse(localStorage.getItem(localUserSettingsStore));
    // Populate the editor
    editor.set(userSettings.data);
};
