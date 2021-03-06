const AliceEditor = (function() {
  const getModule = function(name) {
    return require(`./EditorScripts/${name}`);
  };
  const utilities = getModule('Utilities/Utilities');
  return {
    get Debug() {
      return utilities.Debug;
    },
    get Event() {
      return utilities.Event;
    },

    get GameProperties() {
      return getModule('GameProperties');
    },
    get Scene() {
      return getModule('Scene');
    },
    get SceneObject() {
      return getModule('SceneObject');
    },
    get Sound() {
      return getModule('Sound');
    },

    get File() {
      return getModule('File');
    },
    // get Menu() {return getModule('Menu');},

    get View() {
      return getModule('View');
    },
    get WelcomeView() {
      return getModule('WelcomeView');
    },
    get TutorialView() {
      return getModule('TutorialView');
    },
    get RunView() {
      return getModule('RunView');
    },
    get GalleryView() {
      return getModule('GalleryView');
    },
    get GalleryModalView() {
      return getModule('GalleryModalView');
    },
    get SceneView() {
      return getModule('SceneView');
    },
    get PropertyView() {
      return getModule('PropertyView');
    },
    get ObjectListView() {
      return getModule('ObjectListView');
    },
    get PuzzleEditorView() {
      return getModule('PuzzleEditorView');
    },
    get GameSettingView() {
      return getModule('GameSettingView');
    },
    get PuzzleBuilderView() {
      return getModule('PuzzleBuilderView');
    },
    get HelpView() {
      return getModule('HelpView');
    }
  };
})();

module.exports = AliceEditor;
