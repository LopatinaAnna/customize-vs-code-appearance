import { ElementDefinition } from "./interfaces/ElementDefinition";

export const ELEMENTS: ElementDefinition[] = [
  {
    label: 'Title Bar',
    description: 'The title bar is displayed at the top of the window and shows the name of the current file or application.',
    settings: [
      { label: 'Active Background', section: 'workbench.colorCustomizations', key: 'titleBar.activeBackground', type: 'color', description: 'The background color of the title bar when the window is active. This color is only used on Windows and Linux.' },
      { label: 'Active Foreground', section: 'workbench.colorCustomizations', key: 'titleBar.activeForeground', type: 'color', description: 'The foreground color of the title bar when the window is active.' },
      { label: 'Inactive Background', section: 'workbench.colorCustomizations', key: 'titleBar.inactiveBackground', type: 'color', description: 'The background color of the title bar when the window is inactive.' },
      { label: 'Inactive Foreground', section: 'workbench.colorCustomizations', key: 'titleBar.inactiveForeground', type: 'color', description: 'The foreground color of the title bar when the window is inactive.' },
      { label: 'Border', section: 'workbench.colorCustomizations', key: 'titleBar.border', type: 'color', description: 'The border color of the title bar.' },
    ],
  },
  {
    label: 'Activity Bar',
    description: 'The Activity Bar is usually displayed either on the far left or right of the workbench and allows fast switching between views of the Side Bar.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'activityBar.background', type: 'color', description: 'The background color of the activity bar.' },
      { label: 'Drop Border', section: 'workbench.colorCustomizations', key: 'activityBar.dropBorder', type: 'color', description: 'The border color of the activity bar when a drag operation is in progress.' },
      { label: 'Foreground', section: 'workbench.colorCustomizations', key: 'activityBar.foreground', type: 'color', description: 'The foreground color of the activity bar.' },
      { label: 'Inactive Foreground', section: 'workbench.colorCustomizations', key: 'activityBar.inactiveForeground', type: 'color', description: 'The foreground color of the activity bar when it is inactive.' },
      { label: 'Border', section: 'workbench.colorCustomizations', key: 'activityBar.border', type: 'color', description: 'The border color of the activity bar.' },
      { label: 'Badge Background', section: 'workbench.colorCustomizations', key: 'activityBarBadge.background', type: 'color', description: 'The background color of the activity bar badge.' },
      { label: 'Badge Foreground', section: 'workbench.colorCustomizations', key: 'activityBarBadge.foreground', type: 'color', description: 'The foreground color of the activity bar badge.' },
      { label: 'Active Border', section: 'workbench.colorCustomizations', key: 'activityBar.activeBorder', type: 'color', description: 'The border color of the active activity bar item.' },
      { label: 'Active Background', section: 'workbench.colorCustomizations', key: 'activityBar.activeBackground', type: 'color', description: 'The background color of the active activity bar item.' },
      { label: 'Active Focus Border', section: 'workbench.colorCustomizations', key: 'activityBar.activeFocusBorder', type: 'color', description: 'The focus border color of the active activity bar item.' },
      { label: 'Top Foreground', section: 'workbench.colorCustomizations', key: 'activityBarTop.foreground', type: 'color', description: 'The foreground color of the activity bar when it is positioned at the top.' },
      { label: 'Top Background', section: 'workbench.colorCustomizations', key: 'activityBarTop.background', type: 'color', description: 'The background color of the activity bar when it is positioned at the top.' },
      { label: 'Top Active Background', section: 'workbench.colorCustomizations', key: 'activityBarTop.activeBackground', type: 'color', description: 'The background color of the active activity bar item when the activity bar is positioned at the top.' },
      { label: 'Top Active Border', section: 'workbench.colorCustomizations', key: 'activityBarTop.activeBorder', type: 'color', description: 'The border color of the active activity bar item when the activity bar is positioned at the top.' },
      { label: 'Top Inactive Foreground', section: 'workbench.colorCustomizations', key: 'activityBarTop.inactiveForeground', type: 'color', description: 'The foreground color of the activity bar when it is positioned at the top and inactive.' },
      { label: 'Top Drop Border', section: 'workbench.colorCustomizations', key: 'activityBarTop.dropBorder', type: 'color', description: 'The border color of the activity bar when it is positioned at the top and a drag operation is in progress.' },
      { label: 'Warning Badge Background', section: 'workbench.colorCustomizations', key: 'activityWarningBadge.background', type: 'color', description: 'The background color of the activity bar warning badge.' },
      { label: 'Warning Badge Foreground', section: 'workbench.colorCustomizations', key: 'activityWarningBadge.foreground', type: 'color', description: 'The foreground color of the activity bar warning badge.' },
      { label: 'Error Badge Background', section: 'workbench.colorCustomizations', key: 'activityErrorBadge.background', type: 'color', description: 'The background color of the activity bar error badge.' },
      { label: 'Error Badge Foreground', section: 'workbench.colorCustomizations', key: 'activityErrorBadge.foreground', type: 'color', description: 'The foreground color of the activity bar error badge.' },
      { label: 'Position', section: 'workbench.activityBar', key: 'location', type: 'string', options: ['default', 'top', 'bottom', 'hidden'], description: 'The location of the activity bar. "default" means left in LTR and right in RTL. When positioned at the top or bottom, it takes sidebar colors unless "Top ..." setting customized.' },
    ],
  },
  {
    label: 'Side Bar',
    description: 'The Side Bar contains views like the Explorer and Search.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'sideBar.background', type: 'color', description: 'The background color of the side bar.' },
      { label: 'Foreground', section: 'workbench.colorCustomizations', key: 'sideBar.foreground', type: 'color', description: 'The foreground color of the side bar.' },
      { label: 'Border', section: 'workbench.colorCustomizations', key: 'sideBar.border', type: 'color', description: 'The border color of the side bar.' },
      { label: 'Drop Background', section: 'workbench.colorCustomizations', key: 'sideBar.dropBackground', type: 'color', description: 'The background color of the side bar when an item is dragged over it.' },
      { label: 'Title Foreground', section: 'workbench.colorCustomizations', key: 'sideBarTitle.foreground', type: 'color', description: 'The foreground color of the side bar title.' },
      { label: 'Title Background', section: 'workbench.colorCustomizations', key: 'sideBarTitle.background', type: 'color', description: 'The background color of the side bar title.' },
      { label: 'Title Border', section: 'workbench.colorCustomizations', key: 'sideBarTitle.border', type: 'color', description: 'The border color of the side bar title.' },
      { label: 'Section Header Background', section: 'workbench.colorCustomizations', key: 'sideBarSectionHeader.background', type: 'color', description: 'The background color of the side bar section header.' },
      { label: 'Section Header Foreground', section: 'workbench.colorCustomizations', key: 'sideBarSectionHeader.foreground', type: 'color', description: 'The foreground color of the side bar section header.' },
      { label: 'Section Header Border', section: 'workbench.colorCustomizations', key: 'sideBarSectionHeader.border', type: 'color', description: 'The border color of the side bar section header.' },
      { label: 'Activity Bar Top border', section: 'workbench.colorCustomizations', key: 'sideBarActivityBarTop.border', type: 'color', description: 'The border color of the side bar when the activity bar is positioned at the top.' },
      { label: 'Sticky Scroll Background', section: 'workbench.colorCustomizations', key: 'sideBarStickyScroll.background', type: 'color', description: 'The background color of the side bar sticky scroll.' },
      { label: 'Sticky Scroll Border', section: 'workbench.colorCustomizations', key: 'sideBarStickyScroll.border', type: 'color', description: 'The border color of the side bar sticky scroll.' },
      { label: 'Sticky Scroll Shadow', section: 'workbench.colorCustomizations', key: 'sideBarStickyScroll.shadow', type: 'color', description: 'The shadow color of the side bar sticky scroll.' },
      { label: 'Position', section: 'workbench.sideBar', key: 'location', type: 'string', options: ['left', 'right'], description: 'The position of the side bar.' },
    ],
  },
  {
    label: 'Button control',
    description: 'A set of colors for button widgets such as Open Folder button in the Explorer of a new window.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'button.background', type: 'color', description: 'The background color of buttons.' },
      { label: 'Foreground', section: 'workbench.colorCustomizations', key: 'button.foreground', type: 'color', description: 'The foreground color of buttons.' },
      { label: 'Hover Background', section: 'workbench.colorCustomizations', key: 'button.hoverBackground', type: 'color', description: 'The background color of buttons when hovering.' },
      { label: 'Border', section: 'workbench.colorCustomizations', key: 'button.border', type: 'color', description: 'The border color of buttons.' },
      { label: 'Secondary Background', section: 'workbench.colorCustomizations', key: 'button.secondaryBackground', type: 'color', description: 'The background color of secondary buttons.' },
      { label: 'Secondary Foreground', section: 'workbench.colorCustomizations', key: 'button.secondaryForeground', type: 'color', description: 'The foreground color of secondary buttons.' },
      { label: 'Secondary Hover Background', section: 'workbench.colorCustomizations', key: 'button.secondaryHoverBackground', type: 'color', description: 'The background color of secondary buttons when hovering.' },
      { label: 'Secondary Border', section: 'workbench.colorCustomizations', key: 'button.secondaryBorder', type: 'color', description: 'The border color of secondary buttons.' },
      { label: 'Separator', section: 'workbench.colorCustomizations', key: 'button.separator', type: 'color', description: 'The color of the button separator.' },
    ],
  },
  {
    label: 'Command Center',
    description: 'The command center is a panel that provides quick access to common commands and actions.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'commandCenter.background', type: 'color', description: 'The background color of the command center.' },
      { label: 'Foreground', section: 'workbench.colorCustomizations', key: 'commandCenter.foreground', type: 'color', description: 'The foreground color of the command center.' },
      { label: 'Active Background', section: 'workbench.colorCustomizations', key: 'commandCenter.activeBackground', type: 'color', description: 'The active background color of the command center.' },
      { label: 'Active Foreground', section: 'workbench.colorCustomizations', key: 'commandCenter.activeForeground', type: 'color', description: 'The active foreground color of the command center.' },
      { label: 'Border', section: 'workbench.colorCustomizations', key: 'commandCenter.border', type: 'color', description: 'The border color of the command center.' },
      { label: 'Inactive Foreground', section: 'workbench.colorCustomizations', key: 'commandCenter.inactiveForeground', type: 'color', description: 'The inactive foreground color of the command center.' },
      { label: 'Inactive Border', section: 'workbench.colorCustomizations', key: 'commandCenter.inactiveBorder', type: 'color', description: 'The inactive border color of the command center.' },
      { label: 'Active Border', section: 'workbench.colorCustomizations', key: 'commandCenter.activeBorder', type: 'color', description: 'The active border color of the command center.' },
      { label: 'Debugging Background', section: 'workbench.colorCustomizations', key: 'commandCenter.debuggingBackground', type: 'color', description: 'The debugging background color of the command center.' },
    ],
  },
  {
    label: 'Editor',
    description: 'The editor is the main area where you can view and edit your files.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'editor.background', type: 'color', description: 'Editor background color.' },
      { label: 'Foreground', section: 'workbench.colorCustomizations', key: 'editor.foreground', type: 'color', description: 'Editor default foreground color.' },

      { label: 'Line Number Foreground', section: 'workbench.colorCustomizations', key: 'editorLineNumber.foreground', type: 'color', description: 'Color of editor line numbers.' },
      { label: 'Active Line Number', section: 'workbench.colorCustomizations', key: 'editorLineNumber.activeForeground', type: 'color', description: 'Color of the active editor line number.' },
      { label: 'Dimmed Line Number', section: 'workbench.colorCustomizations', key: 'editorLineNumber.dimmedForeground', type: 'color', description: 'Color of the final editor line when editor.renderFinalNewline is set to dimmed.' },

      { label: 'Cursor Background', section: 'workbench.colorCustomizations', key: 'editorCursor.background', type: 'color', description: 'The background color of the editor cursor. Allows customizing overlapped character color.' },
      { label: 'Cursor Foreground', section: 'workbench.colorCustomizations', key: 'editorCursor.foreground', type: 'color', description: 'Color of the editor cursor.' },

      { label: 'Primary Cursor Foreground', section: 'workbench.colorCustomizations', key: 'editorMultiCursor.primary.foreground', type: 'color', description: 'Color of the primary editor cursor when multiple cursors are present.' },
      { label: 'Primary Cursor Background', section: 'workbench.colorCustomizations', key: 'editorMultiCursor.primary.background', type: 'color', description: 'Background color of the primary editor cursor when multiple cursors are present.' },
      { label: 'Secondary Cursor Foreground', section: 'workbench.colorCustomizations', key: 'editorMultiCursor.secondary.foreground', type: 'color', description: 'Color of secondary editor cursors.' },
      { label: 'Secondary Cursor Background', section: 'workbench.colorCustomizations', key: 'editorMultiCursor.secondary.background', type: 'color', description: 'Background color of secondary editor cursors.' },

      { label: 'Placeholder Foreground', section: 'workbench.colorCustomizations', key: 'editor.placeholder.foreground', type: 'color', description: 'Foreground color of placeholder text in the editor.' },
      { label: 'Composition Border', section: 'workbench.colorCustomizations', key: 'editor.compositionBorder', type: 'color', description: 'Border color for an IME composition.' },

      { label: 'Selection Background', section: 'workbench.colorCustomizations', key: 'editor.selectionBackground', type: 'color', description: 'Color of the editor selection.' },
      { label: 'Selection Foreground', section: 'workbench.colorCustomizations', key: 'editor.selectionForeground', type: 'color', description: 'Color of selected text for high contrast.' },
      { label: 'Inactive Selection Background', section: 'workbench.colorCustomizations', key: 'editor.inactiveSelectionBackground', type: 'color', description: 'Color of selection in an inactive editor. This color must be transparent or it will obscure content.' },

      { label: 'Selection Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.selectionHighlightBackground', type: 'color', description: 'Color for regions matching selection. This color must be transparent or it will obscure content.' },
      { label: 'Selection Highlight Border', section: 'workbench.colorCustomizations', key: 'editor.selectionHighlightBorder', type: 'color', description: 'Border color for regions matching selection.' },

      { label: 'Word Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.wordHighlightBackground', type: 'color', description: 'Background color during read-access. This color must be transparent or it will obscure content.' },
      { label: 'Word Highlight Border', section: 'workbench.colorCustomizations', key: 'editor.wordHighlightBorder', type: 'color', description: 'Border color during read-access.' },
      { label: 'Word Highlight Strong Background', section: 'workbench.colorCustomizations', key: 'editor.wordHighlightStrongBackground', type: 'color', description: 'Background color during write-access. This color must be transparent or it will obscure content.' },
      { label: 'Word Highlight Strong Border', section: 'workbench.colorCustomizations', key: 'editor.wordHighlightStrongBorder', type: 'color', description: 'Border color during write-access.' },
      { label: 'Word Highlight Text Background', section: 'workbench.colorCustomizations', key: 'editor.wordHighlightTextBackground', type: 'color', description: 'Background color of textual occurrences. This color must be transparent or it will obscure content.' },
      { label: 'Word Highlight Text Border', section: 'workbench.colorCustomizations', key: 'editor.wordHighlightTextBorder', type: 'color', description: 'Border color of textual occurrences.' },

      { label: 'Find Match Background', section: 'workbench.colorCustomizations', key: 'editor.findMatchBackground', type: 'color', description: 'Color of the current search match.' },
      { label: 'Find Match Foreground', section: 'workbench.colorCustomizations', key: 'editor.findMatchForeground', type: 'color', description: 'Text color of the current search match.' },
      { label: 'Find Match Highlight Foreground', section: 'workbench.colorCustomizations', key: 'editor.findMatchHighlightForeground', type: 'color', description: 'Foreground of other search matches. This color must be transparent or it will obscure content.' },
      { label: 'Find Match Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.findMatchHighlightBackground', type: 'color', description: 'Background of other search matches. This color must be transparent or it will obscure content.' },
      { label: 'Find Range Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.findRangeHighlightBackground', type: 'color', description: 'Color of range limiting search. This color must be transparent or it will obscure content.' },

      { label: 'Find Match Border', section: 'workbench.colorCustomizations', key: 'editor.findMatchBorder', type: 'color', description: 'Border color of current search match.' },
      { label: 'Find Match Highlight Border', section: 'workbench.colorCustomizations', key: 'editor.findMatchHighlightBorder', type: 'color', description: 'Border color of other search matches. This color must be transparent or it will obscure content.' },
      { label: 'Find Range Highlight Border', section: 'workbench.colorCustomizations', key: 'editor.findRangeHighlightBorder', type: 'color', description: 'Border of range limiting search. This color must be transparent or it will obscure content.' },

      { label: 'Search Results Info Foreground', section: 'workbench.colorCustomizations', key: 'search.resultsInfoForeground', type: 'color', description: 'Color of search results info text.' },

      { label: 'Search Editor Match Background', section: 'workbench.colorCustomizations', key: 'searchEditor.findMatchBackground', type: 'color', description: 'Color of search editor results.' },
      { label: 'Search Editor Match Border', section: 'workbench.colorCustomizations', key: 'searchEditor.findMatchBorder', type: 'color', description: 'Border color of search editor results.' },
      { label: 'Search Editor Input Border', section: 'workbench.colorCustomizations', key: 'searchEditor.textInputBorder', type: 'color', description: 'Search editor input border.' },

      { label: 'Hover Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.hoverHighlightBackground', type: 'color', description: 'Highlight under hovered word. This color must be transparent or it will obscure content.' },

      { label: 'Line Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.lineHighlightBackground', type: 'color', description: 'Highlight of current line.' },
      { label: 'Inactive Line Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.inactiveLineHighlightBackground', type: 'color', description: 'Highlight of current line when inactive.' },
      { label: 'Line Highlight Border', section: 'workbench.colorCustomizations', key: 'editor.lineHighlightBorder', type: 'color', description: 'Border around current line.' },

      { label: 'Unicode Highlight Border', section: 'workbench.colorCustomizations', key: 'editorUnicodeHighlight.border', type: 'color', description: 'Border for unicode highlight.' },
      { label: 'Unicode Highlight Background', section: 'workbench.colorCustomizations', key: 'editorUnicodeHighlight.background', type: 'color', description: 'Background for unicode highlight.' },

      { label: 'Active Link Foreground', section: 'workbench.colorCustomizations', key: 'editorLink.activeForeground', type: 'color', description: 'Color of active links.' },

      { label: 'Range Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.rangeHighlightBackground', type: 'color', description: 'Background of highlighted ranges. This color must be transparent or it will obscure content.' },
      { label: 'Range Highlight Border', section: 'workbench.colorCustomizations', key: 'editor.rangeHighlightBorder', type: 'color', description: 'Border of highlighted ranges.' },

      { label: 'Symbol Highlight Background', section: 'workbench.colorCustomizations', key: 'editor.symbolHighlightBackground', type: 'color', description: 'Background of highlighted symbol. This color must be transparent or it will obscure content.' },
      { label: 'Symbol Highlight Border', section: 'workbench.colorCustomizations', key: 'editor.symbolHighlightBorder', type: 'color', description: 'Border of highlighted symbols.' },

      { label: 'Whitespace Foreground', section: 'workbench.colorCustomizations', key: 'editorWhitespace.foreground', type: 'color', description: 'Color of whitespace characters.' },

      { label: 'Lightbulb Foreground', section: 'workbench.colorCustomizations', key: 'editorLightBulb.foreground', type: 'color', description: 'Lightbulb actions icon color.' },
      { label: 'Lightbulb AutoFix', section: 'workbench.colorCustomizations', key: 'editorLightBulbAutoFix.foreground', type: 'color', description: 'Auto fix lightbulb icon color.' },
      { label: 'Lightbulb AI', section: 'workbench.colorCustomizations', key: 'editorLightBulbAi.foreground', type: 'color', description: 'AI lightbulb icon color.' },

      { label: 'Bracket Match Background', section: 'workbench.colorCustomizations', key: 'editorBracketMatch.background', type: 'color', description: 'Background behind matching brackets.' },
      { label: 'Bracket Match Border', section: 'workbench.colorCustomizations', key: 'editorBracketMatch.border', type: 'color', description: 'Border for matching brackets.' },
      { label: 'Bracket Match Foreground', section: 'workbench.colorCustomizations', key: 'editorBracketMatch.foreground', type: 'color', description: 'Foreground for matching brackets.' },

      { label: 'Bracket Highlight 1', section: 'workbench.colorCustomizations', key: 'editorBracketHighlight.foreground1', type: 'color', description: 'Bracket color level 1.' },
      { label: 'Bracket Highlight 2', section: 'workbench.colorCustomizations', key: 'editorBracketHighlight.foreground2', type: 'color', description: 'Bracket color level 2.' },
      { label: 'Bracket Highlight 3', section: 'workbench.colorCustomizations', key: 'editorBracketHighlight.foreground3', type: 'color', description: 'Bracket color level 3.' },
      { label: 'Bracket Highlight 4', section: 'workbench.colorCustomizations', key: 'editorBracketHighlight.foreground4', type: 'color', description: 'Bracket color level 4.' },
      { label: 'Bracket Highlight 5', section: 'workbench.colorCustomizations', key: 'editorBracketHighlight.foreground5', type: 'color', description: 'Bracket color level 5.' },
      { label: 'Bracket Highlight 6', section: 'workbench.colorCustomizations', key: 'editorBracketHighlight.foreground6', type: 'color', description: 'Bracket color level 6.' },
      { label: 'Unexpected Bracket', section: 'workbench.colorCustomizations', key: 'editorBracketHighlight.unexpectedBracket.foreground', type: 'color', description: 'Color of unexpected brackets.' },

      { label: 'Fold Background', section: 'workbench.colorCustomizations', key: 'editor.foldBackground', type: 'color', description: 'Background for folded ranges. This color must be transparent or it will obscure content.' },
      { label: 'Fold Placeholder Foreground', section: 'workbench.colorCustomizations', key: 'editor.foldPlaceholderForeground', type: 'color', description: 'Color of collapsed text.' },

      { label: 'Overview Ruler Background', section: 'workbench.colorCustomizations', key: 'editorOverviewRuler.background', type: 'color', description: 'Overview ruler background.' },
      { label: 'Overview Ruler Border', section: 'workbench.colorCustomizations', key: 'editorOverviewRuler.border', type: 'color', description: 'Overview ruler border.' },

      { label: 'Error Foreground', section: 'workbench.colorCustomizations', key: 'editorError.foreground', type: 'color', description: 'Error squiggles color.' },
      { label: 'Error Border', section: 'workbench.colorCustomizations', key: 'editorError.border', type: 'color', description: 'Error border.' },
      { label: 'Error Background', section: 'workbench.colorCustomizations', key: 'editorError.background', type: 'color', description: 'Error background. This color must be transparent or it will obscure content.' },

      { label: 'Warning Foreground', section: 'workbench.colorCustomizations', key: 'editorWarning.foreground', type: 'color', description: 'Warning squiggles color.' },
      { label: 'Warning Border', section: 'workbench.colorCustomizations', key: 'editorWarning.border', type: 'color', description: 'Warning border.' },
      { label: 'Warning Background', section: 'workbench.colorCustomizations', key: 'editorWarning.background', type: 'color', description: 'Warning background. This color must be transparent or it will obscure content.' },

      { label: 'Info Foreground', section: 'workbench.colorCustomizations', key: 'editorInfo.foreground', type: 'color', description: 'Info squiggles color.' },
      { label: 'Info Border', section: 'workbench.colorCustomizations', key: 'editorInfo.border', type: 'color', description: 'Info border.' },
      { label: 'Info Background', section: 'workbench.colorCustomizations', key: 'editorInfo.background', type: 'color', description: 'Info background. This color must be transparent or it will obscure content.' },

      { label: 'Hint Foreground', section: 'workbench.colorCustomizations', key: 'editorHint.foreground', type: 'color', description: 'Hint color.' },
      { label: 'Hint Border', section: 'workbench.colorCustomizations', key: 'editorHint.border', type: 'color', description: 'Hint border. ' },

      { label: 'Problems Error Icon', section: 'workbench.colorCustomizations', key: 'problemsErrorIcon.foreground', type: 'color', description: 'Problems error icon color.' },
      { label: 'Problems Warning Icon', section: 'workbench.colorCustomizations', key: 'problemsWarningIcon.foreground', type: 'color', description: 'Problems warning icon color.' },
      { label: 'Problems Info Icon', section: 'workbench.colorCustomizations', key: 'problemsInfoIcon.foreground', type: 'color', description: 'Problems info icon color.' },

      { label: 'Unnecessary Code Border', section: 'workbench.colorCustomizations', key: 'editorUnnecessaryCode.border', type: 'color', description: 'Border for unused code.' },
      { label: 'Unnecessary Code Opacity', section: 'workbench.colorCustomizations', key: 'editorUnnecessaryCode.opacity', type: 'color', description: 'Opacity of unused code.' },

      { label: 'Gutter Background', section: 'workbench.colorCustomizations', key: 'editorGutter.background', type: 'color', description: 'Gutter background.' },
      { label: 'Gutter Modified', section: 'workbench.colorCustomizations', key: 'editorGutter.modifiedBackground', type: 'color', description: 'Modified line gutter.' },
      { label: 'Gutter Added', section: 'workbench.colorCustomizations', key: 'editorGutter.addedBackground', type: 'color', description: 'Added line gutter.' },
      { label: 'Gutter Deleted', section: 'workbench.colorCustomizations', key: 'editorGutter.deletedBackground', type: 'color', description: 'Deleted line gutter.' }
    ],
  },
  {
    label: 'Status Bar',
    description: 'The status bar is displayed at the bottom of the window and shows information about the current file and workspace.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'statusBar.background', type: 'color', description: 'The background color of the status bar.' },
      { label: 'Foreground', section: 'workbench.colorCustomizations', key: 'statusBar.foreground', type: 'color', description: 'The foreground color of the status bar.' },
      { label: 'Border', section: 'workbench.colorCustomizations', key: 'statusBar.border', type: 'color', description: 'The border color of the status bar.' },
      { label: 'No Folder Background', section: 'workbench.colorCustomizations', key: 'statusBar.noFolderBackground', type: 'color', description: 'The background color of the status bar when no folder is open.' },
      { label: 'No Folder Foreground', section: 'workbench.colorCustomizations', key: 'statusBar.noFolderForeground', type: 'color', description: 'The foreground color of the status bar when no folder is open.' },
      { label: 'Debugging Background', section: 'workbench.colorCustomizations', key: 'statusBar.debuggingBackground', type: 'color', description: 'The background color of the status bar when debugging.' },
      { label: 'Debugging Foreground', section: 'workbench.colorCustomizations', key: 'statusBar.debuggingForeground', type: 'color', description: 'The foreground color of the status bar when debugging.' },
      { label: 'Item Active Background', section: 'workbench.colorCustomizations', key: 'statusBarItem.activeBackground', type: 'color', description: 'The background color of the active status bar item.' },
      { label: 'Item Hover Background', section: 'workbench.colorCustomizations', key: 'statusBarItem.hoverBackground', type: 'color', description: 'The background color of the status bar item when hovered.' },
      { label: 'Item Prominent Background', section: 'workbench.colorCustomizations', key: 'statusBarItem.prominentBackground', type: 'color', description: 'The background color of the prominent status bar item.' },
      { label: 'Item Prominent Foreground', section: 'workbench.colorCustomizations', key: 'statusBarItem.prominentForeground', type: 'color', description: 'The foreground color of the prominent status bar item.' },
    ],
  },
  {
    label: 'Panel',
    description: 'The panel is a container for views like the Terminal and Problems.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'panel.background', type: 'color', description: 'The background color of the panel.' },
      { label: 'Foreground', section: 'workbench.colorCustomizations', key: 'panel.foreground', type: 'color', description: 'The foreground color of the panel.' },
      { label: 'Border', section: 'workbench.colorCustomizations', key: 'panel.border', type: 'color', description: 'The border color of the panel.' },
      { label: 'Title Active Border', section: 'workbench.colorCustomizations', key: 'panelTitle.activeBorder', type: 'color', description: 'The border color of the active panel title.' },
      { label: 'Title Active Foreground', section: 'workbench.colorCustomizations', key: 'panelTitle.activeForeground', type: 'color', description: 'The foreground color of the active panel title.' },
      { label: 'Title Inactive Foreground', section: 'workbench.colorCustomizations', key: 'panelTitle.inactiveForeground', type: 'color', description: 'The foreground color of the inactive panel title.' },
      { label: 'Drop Border', section: 'workbench.colorCustomizations', key: 'panel.dropBorder', type: 'color', description: 'The border color of the panel when a drag operation is in progress.' },
    ],
  },
  {
    label: 'Tabs',
    description: 'Tabs are used to switch between open editors in the editor area.',
    settings: [
      { label: 'Active Background', section: 'workbench.colorCustomizations', key: 'tab.activeBackground', type: 'color', description: 'The background color of the active tab.' },
      { label: 'Active Foreground', section: 'workbench.colorCustomizations', key: 'tab.activeForeground', type: 'color', description: 'The foreground color of the active tab.' },
      { label: 'Inactive Background', section: 'workbench.colorCustomizations', key: 'tab.inactiveBackground', type: 'color', description: 'The background color of the inactive tab.' },
      { label: 'Inactive Foreground', section: 'workbench.colorCustomizations', key: 'tab.inactiveForeground', type: 'color', description: 'The foreground color of the inactive tab.' },
      { label: 'Active Border', section: 'workbench.colorCustomizations', key: 'tab.activeBorder', type: 'color', description: 'The border color of the active tab.' },
      { label: 'Inactive Modified Border', section: 'workbench.colorCustomizations', key: 'tab.inactiveModifiedBorder', type: 'color', description: 'The border color of the modified inactive tab.' },
      { label: 'Active Modified Border', section: 'workbench.colorCustomizations', key: 'tab.activeModifiedBorder', type: 'color', description: 'The border color of the modified active tab.' },
      { label: 'Unfocused Active Background', section: 'workbench.colorCustomizations', key: 'tab.unfocusedActiveBackground', type: 'color', description: 'The background color of the unfocused active tab.' },
      { label: 'Unfocused Active Foreground', section: 'workbench.colorCustomizations', key: 'tab.unfocusedActiveForeground', type: 'color', description: 'The foreground color of the unfocused active tab.' },
      { label: 'Unfocused Inactive Background', section: 'workbench.colorCustomizations', key: 'tab.unfocusedInactiveBackground', type: 'color', description: 'The background color of the unfocused inactive tab.' },
      { label: 'Unfocused Inactive Foreground', section: 'workbench.colorCustomizations', key: 'tab.unfocusedInactiveForeground', type: 'color', description: 'The foreground color of the unfocused inactive tab.' },
    ],
  },
  {
    label: 'Minimap',
    description: 'The minimap is a small overview of the source code on the side of the editor.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'minimap.background', type: 'color', description: 'The background color of the minimap.' },
      { label: 'Selection Highlight', section: 'workbench.colorCustomizations', key: 'minimap.selectionHighlight', type: 'color', description: 'Color of the selection highlight in the minimap. The color must not be opaque so that the underlying content can shine through.' },
      { label: 'Error Highlight', section: 'workbench.colorCustomizations', key: 'minimap.errorHighlight', type: 'color', description: 'The color of the error highlight in the minimap.' },
      { label: 'Warning Highlight', section: 'workbench.colorCustomizations', key: 'minimap.warningHighlight', type: 'color', description: 'The color of the warning highlight in the minimap.' },
      { label: 'Find Match Highlight', section: 'workbench.colorCustomizations', key: 'minimap.findMatchHighlight', type: 'color', description: 'The color of the find match highlight in the minimap. This color must be transparent or it will obscure content.' },
      { label: 'Gutter Added Background', section: 'workbench.colorCustomizations', key: 'minimapGutter.addedBackground', type: 'color', description: 'The background color of the added lines gutter in the minimap.' },
      { label: 'Gutter Modified Background', section: 'workbench.colorCustomizations', key: 'minimapGutter.modifiedBackground', type: 'color', description: 'The background color of the modified lines gutter in the minimap.' },
      { label: 'Gutter Deleted Background', section: 'workbench.colorCustomizations', key: 'minimapGutter.deletedBackground', type: 'color', description: 'The background color of the deleted lines gutter in the minimap.' },
    ],
  },
  {
    label: 'Progress Bar',
    description: 'The progress bar is used to show the progress of long running operations.',
    settings: [
      { label: 'Background', section: 'workbench.colorCustomizations', key: 'progressBar.background', type: 'color', description: 'The background color of the progress bar.' },
    ],
  },
];
