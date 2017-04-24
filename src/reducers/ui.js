// @flow

/**
 * UI reducer
 * @module reducers/ui
 */

const makeRecord = require("../utils/makeRecord");
const { prefs } = require("../utils/prefs");

import constants from "../constants";
import type { Action, panelPositionType } from "../actions/types";
import type { Record } from "../utils/makeRecord";

type fileSearchModifiersType = {
  caseSensitive: boolean,
  wholeWord: boolean,
  regexMatch: boolean
};

export type UIState = {
  fileSearchOn: boolean,
  fileSearchQuery: string,
  fileSearchModifiers: Record<fileSearchModifiersType>,
  projectSearchOn: boolean,
  symbolSearchOn: boolean,
  symbolSearchType: "functions" | "variables",
  shownSource: string,
  startPanelCollapsed: boolean,
  endPanelCollapsed: boolean
};

const State = makeRecord(
  ({
    fileSearchOn: false,
    fileSearchQuery: "",
    fileSearchModifiers: makeRecord({
      caseSensitive: true,
      wholeWord: false,
      regexMatch: false
    })(),
    projectSearchOn: false,
    symbolSearchOn: false,
    symbolSearchType: "functions",
    shownSource: "",
    startPanelCollapsed: prefs.startPanelCollapsed,
    endPanelCollapsed: prefs.endPanelCollapsed
  }: UIState)
);

function update(state = State(), action: Action): Record<UIState> {
  switch (action.type) {
    case constants.TOGGLE_PROJECT_SEARCH: {
      return state.set("projectSearchOn", action.value);
    }

    case constants.TOGGLE_FILE_SEARCH: {
      return state.set("fileSearchOn", action.value);
    }

    case constants.TOGGLE_SYMBOL_SEARCH: {
      return state.set("symbolSearchOn", action.value);
    }

    case constants.UPDATE_FILE_SEARCH_QUERY: {
      return state.set("fileSearchQuery", action.query);
    }

    case constants.TOGGLE_FILE_SEARCH_MODIFIER: {
      return state.setIn(
        ["fileSearchModifiers", action.modifier],
        !state.getIn(["fileSearchModifiers", action.modifier])
      );
    }

    case constants.SET_SYMBOL_SEARCH_TYPE: {
      return state.set("symbolSearchType", action.symbolType);
    }

    case constants.SHOW_SOURCE: {
      return state.set("shownSource", action.sourceUrl);
    }

    case constants.TOGGLE_PANE: {
      if (action.position == "start") {
        prefs.startPanelCollapsed = action.paneCollapsed;
        return state.set("startPanelCollapsed", action.paneCollapsed);
      }

      prefs.endPanelCollapsed = action.paneCollapsed;
      return state.set("endPanelCollapsed", action.paneCollapsed);
    }

    default: {
      return state;
    }
  }
}

// NOTE: we'd like to have the app state fully typed
// https://github.com/devtools-html/debugger.html/blob/master/src/reducers/sources.js#L179-L185
type OuterState = { ui: Record<UIState> };

type SearchFieldType = "projectSearchOn" | "fileSearchOn" | "symbolSearchOn";
function getSearchState(field: SearchFieldType, state: OuterState): boolean {
  return state.ui.get(field);
}

function getFileSearchQueryState(state: OuterState): string {
  return state.ui.get("fileSearchQuery");
}

function getFileSearchModifierState(
  state: OuterState
): Record<fileSearchModifiersType> {
  return state.ui.get("fileSearchModifiers");
}

type SymbolSearchType = "functions" | "variables";
function getSymbolSearchType(state: OuterState): SymbolSearchType {
  return state.ui.get("symbolSearchType");
}

const getProjectSearchState = getSearchState.bind(null, "projectSearchOn");
const getFileSearchState = getSearchState.bind(null, "fileSearchOn");
const getSymbolSearchState = getSearchState.bind(null, "symbolSearchOn");

function getShownSource(state: OuterState): boolean {
  return state.ui.get("shownSource");
}

function getPaneCollapse(
  state: OuterState,
  position: panelPositionType
): boolean {
  if (position == "start") {
    return state.ui.get("startPanelCollapsed");
  }

  return state.ui.get("endPanelCollapsed");
}

module.exports = {
  State,
  update,
  getProjectSearchState,
  getFileSearchState,
  getFileSearchQueryState,
  getFileSearchModifierState,
  getSymbolSearchState,
  getSymbolSearchType,
  getShownSource,
  getPaneCollapse
};
