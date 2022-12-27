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

    return editor
}

function hideSettings(editor) {
    /**
     * Hide the settings.
     * 
     * This function is to be called when the settings window
     * is supposed to be hidden, This will automatically
     * handle saving the updated settings to the localstorage.
     */
    modalEl.style.display = "none"
    // Get the updated JSON
    updatedJson = editor.get()
    document.getElementById(jsonContainer).innerHTML = ""
    //location.reload()
}

async function fetchSettings() {
    const response = await fetch("/config.json");
    result = await response.json();
    //localStorage.setItem(localUserSettingsStore, JSON.stringify({"data": result, "time": new Date()}));
    return result;
};

function saveSettings(settings) {
    localStorage.setItem(localUserSettingsStore, JSON.stringify({"data": settings, "time": new Date()}));;
}

async function loadJson(editor) {
    userSettings = JSON.parse(localStorage.getItem(localUserSettingsStore));
    // Populate the editor
    editor.set(userSettings.data);
};
