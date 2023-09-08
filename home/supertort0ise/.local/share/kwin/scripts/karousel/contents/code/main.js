"use strict";
var Actions;
(function (Actions) {
    function init(world, config) {
        return {
            focusLeft: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const prevColumn = grid.getPrevColumn(column);
                    if (prevColumn === null) {
                        return;
                    }
                    prevColumn.focus();
                });
            },
            focusRight: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const nextColumn = grid.getNextColumn(column);
                    if (nextColumn === null) {
                        return;
                    }
                    nextColumn.focus();
                });
            },
            focusUp: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const prevWindow = column.getPrevWindow(window);
                    if (prevWindow === null) {
                        return;
                    }
                    prevWindow.focus();
                });
            },
            focusDown: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const nextWindow = column.getNextWindow(window);
                    if (nextWindow === null) {
                        return;
                    }
                    nextWindow.focus();
                });
            },
            focusStart: () => {
                const grid = world.getCurrentGrid();
                const firstColumn = grid.getFirstColumn();
                if (firstColumn === null) {
                    return;
                }
                firstColumn.focus();
                grid.container.arrange();
            },
            focusEnd: () => {
                const grid = world.getCurrentGrid();
                const lastColumn = grid.getLastColumn();
                if (lastColumn === null) {
                    return;
                }
                lastColumn.focus();
                grid.container.arrange();
            },
            windowMoveLeft: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    if (column.getWindowCount() === 1) {
                        // move from own column into existing column
                        const prevColumn = grid.getPrevColumn(column);
                        if (prevColumn === null) {
                            return;
                        }
                        window.moveToColumn(prevColumn);
                        grid.container.onGridReordered();
                    }
                    else {
                        // move from shared column into own column
                        const newColumn = new Column(grid, grid.getPrevColumn(column));
                        window.moveToColumn(newColumn);
                    }
                    grid.container.arrange();
                });
            },
            windowMoveRight: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    if (column.getWindowCount() === 1) {
                        // move from own column into existing column
                        const nextColumn = grid.getNextColumn(column);
                        if (nextColumn === null) {
                            return;
                        }
                        window.moveToColumn(nextColumn);
                        grid.container.onGridReordered();
                    }
                    else {
                        // move from shared column into own column
                        const newColumn = new Column(grid, column);
                        window.moveToColumn(newColumn);
                    }
                    grid.container.arrange();
                });
            },
            windowMoveUp: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveWindowUp(window);
                    grid.container.arrange(); // TODO (optimization): only arrange moved windows
                });
            },
            windowMoveDown: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveWindowDown(window);
                    grid.container.arrange(); // TODO (optimization): only arrange moved windows
                });
            },
            windowMoveStart: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const newColumn = new Column(grid, null);
                    window.moveToColumn(newColumn);
                    grid.container.arrange();
                });
            },
            windowMoveEnd: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const newColumn = new Column(grid, grid.getLastColumn());
                    window.moveToColumn(newColumn);
                    grid.container.arrange();
                });
            },
            windowToggleFloating: () => {
                const kwinClient = workspace.activeClient;
                world.toggleFloatingClient(kwinClient);
            },
            columnMoveLeft: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    grid.moveColumnLeft(column);
                    grid.container.arrange();
                });
            },
            columnMoveRight: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    grid.moveColumnRight(column);
                    grid.container.arrange();
                });
            },
            columnMoveStart: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveAfter(null);
                    grid.container.arrange();
                });
            },
            columnMoveEnd: () => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    column.moveAfter(grid.getLastColumn());
                    grid.container.arrange();
                });
            },
            columnToggleStacked: () => {
                world.doIfTiledFocused(false, (window, column, grid) => {
                    column.toggleStacked();
                    grid.container.arrange();
                });
            },
            columnWidthIncrease: () => {
                world.doIfTiledFocused(false, (window, column, grid) => {
                    grid.increaseColumnWidth(column);
                    grid.container.arrange();
                });
            },
            columnWidthDecrease: () => {
                world.doIfTiledFocused(false, (window, column, grid) => {
                    grid.decreaseColumnWidth(column);
                    grid.container.arrange();
                });
            },
            gridScrollLeft: () => {
                gridScroll(world, -config.manualScrollStep);
            },
            gridScrollRight: () => {
                gridScroll(world, config.manualScrollStep);
            },
            gridScrollStart: () => {
                const grid = world.getCurrentGrid();
                const firstColumn = grid.getFirstColumn();
                if (firstColumn === null) {
                    return;
                }
                grid.container.scrollToColumn(firstColumn);
                grid.container.arrange();
            },
            gridScrollEnd: () => {
                const grid = world.getCurrentGrid();
                const lastColumn = grid.getLastColumn();
                if (lastColumn === null) {
                    return;
                }
                grid.container.scrollToColumn(lastColumn);
                grid.container.arrange();
            },
            gridScrollFocused: () => {
                const focusedWindow = world.getFocusedWindow();
                if (focusedWindow === null) {
                    return;
                }
                const column = focusedWindow.column;
                const grid = column.grid;
                grid.container.scrollCenterColumn(column);
                grid.container.arrange();
            },
            gridScrollLeftColumn: () => {
                const grid = world.getCurrentGrid();
                const column = grid.getLeftmostVisibleColumn(grid.container.getCurrentScrollPos(), true);
                if (column === null) {
                    return;
                }
                const prevColumn = grid.getPrevColumn(column);
                if (prevColumn === null) {
                    return;
                }
                grid.container.scrollToColumn(prevColumn);
                grid.container.arrange();
            },
            gridScrollRightColumn: () => {
                const grid = world.getCurrentGrid();
                const column = grid.getRightmostVisibleColumn(grid.container.getCurrentScrollPos(), true);
                if (column === null) {
                    return;
                }
                const nextColumn = grid.getNextColumn(column);
                if (nextColumn === null) {
                    return;
                }
                grid.container.scrollToColumn(nextColumn);
                grid.container.arrange();
            },
        };
    }
    Actions.init = init;
    function initNum(world) {
        return {
            focusColumn: (columnIndex) => {
                const grid = world.getCurrentGrid();
                const targetColumn = grid.getColumnAtIndex(columnIndex);
                if (targetColumn === null) {
                    return null;
                }
                targetColumn.focus();
            },
            windowMoveToColumn: (columnIndex) => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null) {
                        return null;
                    }
                    window.moveToColumn(targetColumn);
                    grid.container.onGridReordered();
                    grid.container.arrange();
                });
            },
            columnMoveToColumn: (columnIndex) => {
                world.doIfTiledFocused(true, (window, column, grid) => {
                    const targetColumn = grid.getColumnAtIndex(columnIndex);
                    if (targetColumn === null || targetColumn === column) {
                        return null;
                    }
                    if (targetColumn.isAfter(column)) {
                        column.moveAfter(targetColumn);
                    }
                    else {
                        column.moveAfter(grid.getPrevColumn(targetColumn));
                    }
                    grid.container.arrange();
                });
            },
            columnMoveToDesktop: (desktopIndex) => {
                world.doIfTiledFocused(true, (window, column, oldGrid) => {
                    const desktopNumber = desktopIndex + 1;
                    const newGrid = world.getGridInCurrentActivity(desktopNumber);
                    if (newGrid === null || newGrid === oldGrid) {
                        return;
                    }
                    column.moveToGrid(newGrid, newGrid.getLastColumn());
                    oldGrid.container.arrange();
                    newGrid.container.arrange();
                });
            },
            tailMoveToDesktop: (desktopIndex) => {
                world.doIfTiledFocused(true, (window, column, oldGrid) => {
                    const desktopNumber = desktopIndex + 1;
                    const newGrid = world.getGridInCurrentActivity(desktopNumber);
                    if (newGrid === null || newGrid === oldGrid) {
                        return;
                    }
                    oldGrid.evacuateTail(newGrid, column);
                    oldGrid.container.arrange();
                    newGrid.container.arrange();
                });
            },
        };
    }
    Actions.initNum = initNum;
    function gridScroll(world, amount) {
        const scrollAmount = amount;
        const grid = world.getCurrentGrid();
        grid.container.adjustScroll(scrollAmount, false);
        grid.container.arrange();
    }
})(Actions || (Actions = {}));
function init() {
    const config = loadConfig();
    const world = new World(config);
    registerKeyBindings(world, config);
    return world;
}
function initWorkspaceSignalHandlers(world) {
    const manager = new SignalManager();
    manager.connect(workspace.clientAdded, (kwinClient) => {
        console.assert(!world.hasClient(kwinClient));
        if (Clients.canTileEver(kwinClient)) {
            // never open new tileable clients on all desktops or activities
            if (kwinClient.desktop <= 0) {
                kwinClient.desktop = workspace.currentDesktop;
            }
            if (kwinClient.activities.length !== 1) {
                kwinClient.activities = [workspace.currentActivity];
            }
        }
        world.addClient(kwinClient);
    });
    manager.connect(workspace.clientRemoved, (kwinClient) => {
        console.assert(world.hasClient(kwinClient));
        world.removeClient(kwinClient, true);
    });
    manager.connect(workspace.clientMinimized, (kwinClient) => {
        world.minimizeClient(kwinClient);
    });
    manager.connect(workspace.clientUnminimized, (kwinClient) => {
        world.unminimizeClient(kwinClient);
    });
    manager.connect(workspace.clientMaximizeSet, (kwinClient, horizontally, vertically) => {
        world.doIfTiled(kwinClient, false, (window, column, grid) => {
            window.onMaximizedChanged(horizontally, vertically);
            grid.container.arrange();
        });
    });
    manager.connect(workspace.clientActivated, (kwinClient) => {
        if (kwinClient === null) {
            return;
        }
        world.onClientFocused(kwinClient);
        world.doIfTiled(kwinClient, true, (window, column, grid) => {
            window.onFocused();
            grid.container.arrange();
        });
    });
    manager.connect(workspace.clientFullScreenSet, (kwinClient, fullScreen, user) => {
        world.doIfTiled(kwinClient, false, (window, column, grid) => {
            window.onFullScreenChanged(fullScreen);
            grid.container.arrange();
        });
    });
    manager.connect(workspace.numberDesktopsChanged, (oldNumberOfDesktops) => {
        world.updateDesktops();
    });
    manager.connect(workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });
    return manager;
}
const defaultWindowRules = `[
    {
        "class": "ksmserver-logout-greeter",
        "tile": false
    },
    {
        "class": "kcalc",
        "tile": false
    },
    {
        "class": "kfind",
        "tile": true
    },
    {
        "class": "kruler",
        "tile": false
    },
    {
        "class": "zoom",
        "caption": "Zoom Cloud Meetings",
        "tile": false
    },
    {
        "class": "zoom",
        "caption": "zoom",
        "tile": false
    },
    {
        "class": "jetbrains-idea",
        "caption": "splash",
        "tile": false
    },
    {
        "class": "jetbrains-studio",
        "caption": "splash",
        "tile": false
    },
    {
        "class": "jetbrains-idea",
        "caption": "Unstash Changes|Paths Affected by stash@.*",
        "tile": true
    },
    {
        "class": "jetbrains-studio",
        "caption": "Unstash Changes|Paths Affected by stash@.*",
        "tile": true
    }
]`;
const configDef = [
    {
        "name": "gapsOuterTop",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsOuterBottom",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsOuterLeft",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsOuterRight",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsInnerHorizontal",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "gapsInnerVertical",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "overscroll",
        "type": "UInt",
        "default": 18
    },
    {
        "name": "manualScrollStep",
        "type": "UInt",
        "default": 200
    },
    {
        "name": "untileOnDrag",
        "type": "Bool",
        "default": true
    },
    {
        "name": "stackColumnsByDefault",
        "type": "Bool",
        "default": false
    },
    {
        "name": "resizeNeighborColumn",
        "type": "Bool",
        "default": false
    },
    {
        "name": "windowRules",
        "type": "String",
        "default": defaultWindowRules
    }
];
function loadConfig() {
    const config = {};
    for (const entry of configDef) {
        config[entry.name] = KWin.readConfig(entry.name, entry.default);
    }
    return config;
}
const keyBindings = [
    {
        "name": "window-toggle-floating",
        "description": "Toggle floating",
        "defaultKeySequence": "Meta+Space",
        "action": "windowToggleFloating",
    },
    {
        "name": "focus-left",
        "description": "Move focus left",
        "defaultKeySequence": "Meta+A",
        "action": "focusLeft",
    },
    {
        "name": "focus-right",
        "description": "Move focus right",
        "defaultKeySequence": "Meta+D",
        "action": "focusRight",
    },
    {
        "name": "focus-up",
        "description": "Move focus up",
        "defaultKeySequence": "Meta+W",
        "action": "focusUp",
    },
    {
        "name": "focus-down",
        "description": "Move focus down",
        "defaultKeySequence": "Meta+S",
        "action": "focusDown",
    },
    {
        "name": "focus-start",
        "description": "Move focus to start",
        "defaultKeySequence": "Meta+Home",
        "action": "focusStart",
    },
    {
        "name": "focus-end",
        "description": "Move focus to end",
        "defaultKeySequence": "Meta+End",
        "action": "focusEnd",
    },
    {
        "name": "window-move-left",
        "description": "Move window left",
        "comment": "Moves window out of and into columns",
        "defaultKeySequence": "Meta+Shift+A",
        "action": "windowMoveLeft",
    },
    {
        "name": "window-move-right",
        "description": "Move window right",
        "comment": "Moves window out of and into columns",
        "defaultKeySequence": "Meta+Shift+D",
        "action": "windowMoveRight",
    },
    {
        "name": "window-move-up",
        "description": "Move window up",
        "defaultKeySequence": "Meta+Shift+W",
        "action": "windowMoveUp",
    },
    {
        "name": "window-move-down",
        "description": "Move window down",
        "defaultKeySequence": "Meta+Shift+S",
        "action": "windowMoveDown",
    },
    {
        "name": "window-move-start",
        "description": "Move window to start",
        "defaultKeySequence": "Meta+Shift+Home",
        "action": "windowMoveStart",
    },
    {
        "name": "window-move-end",
        "description": "Move window to end",
        "defaultKeySequence": "Meta+Shift+End",
        "action": "windowMoveEnd",
    },
    {
        "name": "column-toggle-stacked",
        "description": "Toggle stacked layout for focused column",
        "defaultKeySequence": "Meta+X",
        "action": "columnToggleStacked",
    },
    {
        "name": "column-move-left",
        "description": "Move column left",
        "defaultKeySequence": "Meta+Ctrl+Shift+A",
        "action": "columnMoveLeft",
    },
    {
        "name": "column-move-right",
        "description": "Move column right",
        "defaultKeySequence": "Meta+Ctrl+Shift+D",
        "action": "columnMoveRight",
    },
    {
        "name": "column-move-start",
        "description": "Move column to start",
        "defaultKeySequence": "Meta+Ctrl+Shift+Home",
        "action": "columnMoveStart",
    },
    {
        "name": "column-move-end",
        "description": "Move column to end",
        "defaultKeySequence": "Meta+Ctrl+Shift+End",
        "action": "columnMoveEnd",
    },
    {
        "name": "column-width-increase",
        "description": "Increase column width",
        "defaultKeySequence": "Meta+Ctrl++",
        "action": "columnWidthIncrease",
    },
    {
        "name": "column-width-decrease",
        "description": "Decrease column width",
        "defaultKeySequence": "Meta+Ctrl+-",
        "action": "columnWidthDecrease",
    },
    {
        "name": "grid-scroll-focused",
        "description": "Center focused window",
        "comment": "Scrolls so that the focused window is centered in the screen",
        "defaultKeySequence": "Meta+Alt+Return",
        "action": "gridScrollFocused",
    },
    {
        "name": "grid-scroll-left-column",
        "description": "Scroll one column to the left",
        "defaultKeySequence": "Meta+Alt+A",
        "action": "gridScrollLeftColumn",
    },
    {
        "name": "grid-scroll-right-column",
        "description": "Scroll one column to the right",
        "defaultKeySequence": "Meta+Alt+D",
        "action": "gridScrollRightColumn",
    },
    {
        "name": "grid-scroll-left",
        "description": "Scroll left",
        "defaultKeySequence": "Meta+Alt+PgUp",
        "action": "gridScrollLeft",
    },
    {
        "name": "grid-scroll-right",
        "description": "Scroll right",
        "defaultKeySequence": "Meta+Alt+PgDown",
        "action": "gridScrollRight",
    },
    {
        "name": "grid-scroll-start",
        "description": "Scroll to start",
        "defaultKeySequence": "Meta+Alt+Home",
        "action": "gridScrollStart",
    },
    {
        "name": "grid-scroll-end",
        "description": "Scroll to end",
        "defaultKeySequence": "Meta+Alt+End",
        "action": "gridScrollEnd",
    },
];
const numKeyBindings = [
    {
        "name": "focus-",
        "description": "Move focus to column ",
        "defaultModifiers": "Meta",
        "fKeys": false,
        "action": "focusColumn",
    },
    {
        "name": "window-move-to-column-",
        "description": "Move window to column ",
        "comment": "Requires manual remapping according to your keyboard layout, e.g. Meta+Shift+1 -> Meta+!",
        "defaultModifiers": "Meta+Shift",
        "fKeys": false,
        "action": "windowMoveToColumn",
    },
    {
        "name": "column-move-to-column-",
        "description": "Move column to position ",
        "comment": "Requires manual remapping according to your keyboard layout, e.g. Meta+Ctrl+Shift+1 -> Meta+Ctrl+!",
        "defaultModifiers": "Meta+Ctrl+Shift",
        "fKeys": false,
        "action": "columnMoveToColumn",
    },
    {
        "name": "column-move-to-desktop-",
        "description": "Move column to desktop ",
        "defaultModifiers": "Meta+Ctrl+Shift",
        "fKeys": true,
        "action": "columnMoveToDesktop",
    },
    {
        "name": "tail-move-to-desktop-",
        "description": "Move this and all following columns to desktop ",
        "defaultModifiers": "Meta+Ctrl+Shift+Alt",
        "fKeys": true,
        "action": "tailMoveToDesktop",
    },
];
function catchWrap(f) {
    return () => {
        try {
            f();
        }
        catch (error) {
            console.log(error);
            console.log(error.stack);
        }
    };
}
function registerKeyBinding(name, description, keySequence, callback) {
    KWin.registerShortcut("karousel-" + name, "Karousel: " + description, keySequence, catchWrap(callback));
}
function registerNumKeyBindings(name, description, modifiers, fKeys, callback) {
    const numPrefix = fKeys ? "F" : "";
    const n = fKeys ? 12 : 9;
    for (let i = 0; i < n; i++) {
        const numKey = String(i + 1);
        registerKeyBinding(name + numKey, description + numKey, modifiers + "+" + numPrefix + numKey, () => callback(i));
    }
}
function registerKeyBindings(world, config) {
    const actions = Actions.init(world, config);
    for (const binding of keyBindings) {
        registerKeyBinding(binding.name, binding.description, binding.defaultKeySequence, actions[binding.action]);
    }
    const numActions = Actions.initNum(world);
    for (const binding of numKeyBindings) {
        registerNumKeyBindings(binding.name, binding.description, binding.defaultModifiers, binding.fKeys, numActions[binding.action]);
    }
}
class Column {
    constructor(grid, prevColumn) {
        this.gridX = 0;
        this.width = 0;
        this.windows = new LinkedList();
        this.stacked = grid.config.stackColumnsByDefault;
        this.focusTaker = null;
        this.grid = grid;
        this.grid.onColumnAdded(this, prevColumn);
    }
    moveToGrid(targetGrid, prevColumn) {
        if (targetGrid === this.grid) {
            this.grid.onColumnMoved(this, prevColumn);
        }
        else {
            this.grid.onColumnRemoved(this, false);
            this.grid = targetGrid;
            targetGrid.onColumnAdded(this, prevColumn);
            for (const window of this.windows.iterator()) {
                window.client.kwinClient.desktop = targetGrid.container.desktop;
            }
        }
    }
    moveAfter(prevColumn) {
        if (prevColumn === this) {
            return;
        }
        this.grid.onColumnMoved(this, prevColumn);
    }
    isAfter(other) {
        return this.gridX > other.gridX;
    }
    isBefore(other) {
        return this.gridX < other.gridX;
    }
    moveWindowUp(window) {
        this.windows.moveBack(window);
    }
    moveWindowDown(window) {
        this.windows.moveForward(window);
    }
    getWindowCount() {
        return this.windows.length();
    }
    isEmpty() {
        return this.getWindowCount() === 0;
    }
    getPrevWindow(window) {
        return this.windows.getPrev(window);
    }
    getNextWindow(window) {
        return this.windows.getNext(window);
    }
    getWidth() {
        return this.width;
    }
    getMinWidth() {
        let maxMinWidth = Column.minWidth;
        for (const window of this.windows.iterator()) {
            const minWidth = window.client.kwinClient.minSize.width;
            if (minWidth > maxMinWidth) {
                maxMinWidth = minWidth;
            }
        }
        return maxMinWidth;
    }
    getMaxWidth() {
        return this.grid.container.tilingArea.width;
    }
    setWidth(width, setPreferred) {
        width = clamp(width, this.getMinWidth(), this.getMaxWidth());
        const oldWidth = this.width;
        this.width = width;
        if (setPreferred) {
            for (const window of this.windows.iterator()) {
                window.client.preferredWidth = width;
            }
        }
        if (width !== oldWidth) {
            this.grid.onColumnWidthChanged(this, oldWidth, width);
        }
    }
    adjustWidth(widthDelta, setPreferred) {
        this.setWidth(this.width + widthDelta, setPreferred);
    }
    // returns x position of left edge in grid space
    getLeft() {
        return this.gridX;
    }
    // returns x position of right edge in grid space
    getRight() {
        return this.gridX + this.width;
    }
    adjustWindowHeight(window, heightDelta, top) {
        const otherWindow = top ? this.windows.getPrev(window) : this.windows.getNext(window);
        if (otherWindow === null) {
            return;
        }
        window.height += heightDelta;
        otherWindow.height -= heightDelta;
    }
    resizeWindows() {
        const nWindows = this.windows.length();
        if (nWindows === 0) {
            return;
        }
        if (nWindows === 1) {
            this.stacked = this.grid.config.stackColumnsByDefault;
        }
        let remainingPixels = this.grid.container.tilingArea.height - (nWindows - 1) * this.grid.config.gapsInnerVertical;
        let remainingWindows = nWindows;
        for (const window of this.windows.iterator()) {
            const windowHeight = Math.round(remainingPixels / remainingWindows);
            window.height = windowHeight;
            remainingPixels -= windowHeight;
            remainingWindows--;
        }
        // TODO: respect min height
    }
    getFocusTaker() {
        if (this.focusTaker === null || !this.windows.contains(this.focusTaker)) {
            return null;
        }
        return this.focusTaker;
    }
    focus() {
        const window = this.getFocusTaker() ?? this.windows.getFirst();
        if (window === null) {
            return;
        }
        window.focus();
    }
    arrange(x) {
        if (this.stacked && this.windows.length() >= 2) {
            this.arrangeStacked(x);
            return;
        }
        let y = this.grid.container.tilingArea.y;
        for (const window of this.windows.iterator()) {
            window.client.setShade(false);
            window.arrange(x, y, this.width, window.height);
            y += window.height + this.grid.config.gapsInnerVertical;
        }
    }
    arrangeStacked(x) {
        const expandedWindow = this.getFocusTaker();
        let collapsedHeight;
        for (const window of this.windows.iterator()) {
            if (window === expandedWindow) {
                window.client.setShade(false);
            }
            else {
                window.client.setShade(true);
                collapsedHeight = window.client.kwinClient.frameGeometry.height;
            }
        }
        const nCollapsed = this.getWindowCount() - 1;
        const expandedHeight = this.grid.container.tilingArea.height - nCollapsed * (collapsedHeight + this.grid.config.gapsInnerVertical);
        let y = this.grid.container.tilingArea.y;
        for (const window of this.windows.iterator()) {
            if (window === expandedWindow) {
                window.arrange(x, y, this.width, expandedHeight);
                y += expandedHeight;
            }
            else {
                window.arrange(x, y, this.width, window.height);
                y += collapsedHeight;
            }
            y += this.grid.config.gapsInnerVertical;
        }
    }
    toggleStacked() {
        if (this.windows.length() < 2) {
            return;
        }
        this.stacked = !this.stacked;
    }
    isVisible(scrollPos, fullyVisible) {
        if (fullyVisible) {
            return this.getLeft() >= scrollPos.getLeft() &&
                this.getRight() <= scrollPos.getRight();
        }
        else {
            return this.getRight() + this.grid.config.gapsInnerHorizontal > scrollPos.getLeft() &&
                this.getLeft() - this.grid.config.gapsInnerHorizontal < scrollPos.getRight();
        }
    }
    onWindowAdded(window) {
        this.windows.insertEnd(window);
        if (this.width === 0) {
            this.setWidth(window.client.preferredWidth, false);
        }
        // TODO: also change column width if the new window requires it
        this.resizeWindows();
        if (window.isFocused()) {
            this.onWindowFocused(window);
        }
    }
    onWindowRemoved(window, passFocus) {
        const lastWindow = this.windows.length() === 1;
        const windowToFocus = this.getPrevWindow(window) ?? this.getNextWindow(window);
        this.windows.remove(window);
        if (window === this.focusTaker) {
            this.focusTaker = windowToFocus;
        }
        if (lastWindow) {
            console.assert(this.isEmpty());
            this.destroy(passFocus);
        }
        else {
            this.resizeWindows();
            if (passFocus && windowToFocus !== null) {
                windowToFocus.focus();
            }
        }
    }
    onWindowFocused(window) {
        this.grid.onColumnFocused(this);
        this.focusTaker = window;
    }
    restoreToTiled() {
        const lastFocusedWindow = this.getFocusTaker();
        if (lastFocusedWindow !== null) {
            lastFocusedWindow.restoreToTiled();
        }
    }
    destroy(passFocus) {
        this.grid.onColumnRemoved(this, passFocus);
    }
}
Column.minWidth = 10;
class Grid {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.columns = new LinkedList();
        this.lastFocusedColumn = null;
        this.width = 0;
        this.userResize = false;
        this.userResizeFinishedDelayer = new Delayer(50, () => {
            // this delay prevents windows' contents from freezing after resizing
            this.container.onGridWidthChanged();
            this.container.arrange();
        });
    }
    moveColumnLeft(column) {
        this.columns.moveBack(column);
        this.columnsSetX(column);
        this.container.onGridWidthChanged();
    }
    moveColumnRight(column) {
        const nextColumn = this.columns.getNext(column);
        if (nextColumn === null) {
            return;
        }
        this.moveColumnLeft(nextColumn);
    }
    getWidth() {
        return this.width;
    }
    getPrevColumn(column) {
        return this.columns.getPrev(column);
    }
    getNextColumn(column) {
        return this.columns.getNext(column);
    }
    getFirstColumn() {
        return this.columns.getFirst();
    }
    getLastColumn() {
        return this.columns.getLast();
    }
    getColumnAtIndex(i) {
        return this.columns.getItemAtIndex(i);
    }
    getLastFocusedColumn() {
        if (this.lastFocusedColumn === null || this.lastFocusedColumn.grid !== this) {
            return null;
        }
        return this.lastFocusedColumn;
    }
    columnsSetX(firstMovedColumn) {
        const lastUnmovedColumn = firstMovedColumn === null ? this.columns.getLast() : this.columns.getPrev(firstMovedColumn);
        let x = lastUnmovedColumn === null ? 0 : lastUnmovedColumn.getRight() + this.config.gapsInnerHorizontal;
        if (firstMovedColumn !== null) {
            for (const column of this.columns.iteratorFrom(firstMovedColumn)) {
                column.gridX = x;
                x += column.getWidth() + this.config.gapsInnerHorizontal;
            }
        }
        this.width = x - this.config.gapsInnerHorizontal;
    }
    getLeftmostVisibleColumn(scrollPos, fullyVisible) {
        const scrollX = scrollPos.getLeft();
        for (const column of this.columns.iterator()) {
            const x = fullyVisible ? column.getLeft() : column.getRight() + (this.config.gapsInnerHorizontal - 1);
            if (x >= scrollX) {
                return column;
            }
        }
        return null;
    }
    getRightmostVisibleColumn(scrollPos, fullyVisible) {
        const scrollX = scrollPos.getRight();
        let last = null;
        for (const column of this.columns.iterator()) {
            const x = fullyVisible ? column.getRight() : column.getLeft() - (this.config.gapsInnerHorizontal - 1);
            if (x <= scrollX) {
                last = column;
            }
            else {
                break;
            }
        }
        return last;
    }
    getVisibleColumnsWidth(scrollPos, fullyVisible) {
        let width = 0;
        let nVisible = 0;
        for (const column of this.columns.iterator()) {
            if (column.isVisible(scrollPos, fullyVisible)) {
                width += column.getWidth();
                nVisible++;
            }
        }
        if (nVisible > 0) {
            width += (nVisible - 1) * this.config.gapsInnerHorizontal;
        }
        return width;
    }
    getLeftOffScreenColumn(scrollPos) {
        const leftVisible = this.getLeftmostVisibleColumn(scrollPos, true);
        if (leftVisible === null) {
            return null;
        }
        return this.getPrevColumn(leftVisible);
    }
    getRightOffScreenColumn(scrollPos) {
        const rightVisible = this.getRightmostVisibleColumn(scrollPos, true);
        if (rightVisible === null) {
            return null;
        }
        return this.getNextColumn(rightVisible);
    }
    increaseColumnWidth(column) {
        const scrollPos = this.container.getScrollPosForColumn(column);
        if (this.width < scrollPos.width) {
            column.adjustWidth(scrollPos.width - this.width, false);
            return;
        }
        let leftColumn = this.getLeftmostVisibleColumn(scrollPos, false);
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightmostVisibleColumn(scrollPos, false);
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }
        const leftVisibleWidth = leftColumn === null ? Infinity : leftColumn.getRight() - scrollPos.getLeft();
        const rightVisibleWidth = rightColumn === null ? Infinity : scrollPos.getRight() - rightColumn.getLeft();
        const expandLeft = leftVisibleWidth < rightVisibleWidth;
        const widthDelta = (expandLeft ? leftVisibleWidth : rightVisibleWidth) + this.config.gapsInnerHorizontal;
        if (expandLeft) {
            this.container.adjustScroll(widthDelta, false);
        }
        column.adjustWidth(widthDelta, true);
    }
    decreaseColumnWidth(column) {
        const scrollPos = this.container.getScrollPosForColumn(column);
        if (this.width <= scrollPos.width) {
            column.setWidth(Math.round(column.getWidth() / 2), false);
            return;
        }
        let leftColumn = this.getLeftOffScreenColumn(scrollPos);
        if (leftColumn === column) {
            leftColumn = null;
        }
        let rightColumn = this.getRightOffScreenColumn(scrollPos);
        if (rightColumn === column) {
            rightColumn = null;
        }
        if (leftColumn === null && rightColumn === null) {
            return;
        }
        const leftInvisibleWidth = leftColumn === null ? Infinity : scrollPos.getLeft() - leftColumn.getLeft();
        const rightInvisibleWidth = rightColumn === null ? Infinity : rightColumn.getRight() - scrollPos.getRight();
        const shrinkLeft = leftInvisibleWidth < rightInvisibleWidth;
        const widthDelta = (shrinkLeft ? leftInvisibleWidth : rightInvisibleWidth);
        console.log("widthDelta", widthDelta);
        if (shrinkLeft) {
            const maxDelta = column.getWidth() - column.getMinWidth();
            this.container.adjustScroll(-Math.min(widthDelta, maxDelta), false);
        }
        column.adjustWidth(-widthDelta, true);
    }
    arrange(x) {
        for (const column of this.columns.iterator()) {
            column.arrange(x);
            x += column.getWidth() + this.config.gapsInnerHorizontal;
        }
    }
    onColumnAdded(column, prevColumn) {
        if (prevColumn === null) {
            this.columns.insertStart(column);
        }
        else {
            this.columns.insertAfter(column, prevColumn);
        }
        this.columnsSetX(column);
        this.container.onGridWidthChanged();
    }
    onColumnRemoved(column, passFocus) {
        const isLastColumn = this.columns.length() === 1;
        const nextColumn = this.getNextColumn(column);
        const columnToFocus = isLastColumn ? null : this.getPrevColumn(column) ?? nextColumn;
        if (column === this.lastFocusedColumn) {
            this.lastFocusedColumn = columnToFocus;
        }
        this.columns.remove(column);
        this.columnsSetX(nextColumn);
        if (passFocus && columnToFocus !== null) {
            columnToFocus.focus();
        }
        else {
            this.container.onGridWidthChanged();
        }
    }
    onColumnMoved(column, prevColumn) {
        const movedLeft = prevColumn === null ? true : column.isAfter(prevColumn);
        const firstMovedColumn = movedLeft ? column : this.getNextColumn(column);
        this.columns.move(column, prevColumn);
        this.columnsSetX(firstMovedColumn);
        this.container.onGridReordered();
    }
    onColumnWidthChanged(column, oldWidth, width) {
        const nextColumn = this.columns.getNext(column);
        this.columnsSetX(nextColumn);
        if (!this.userResize) {
            this.container.onGridWidthChanged();
        }
    }
    onColumnFocused(column) {
        const lastFocusedColumn = this.getLastFocusedColumn();
        if (lastFocusedColumn !== null) {
            lastFocusedColumn.restoreToTiled();
        }
        this.lastFocusedColumn = column;
        this.container.scrollToColumn(column);
    }
    onScreenSizeChanged() {
        for (const column of this.columns.iterator()) {
            column.resizeWindows();
        }
    }
    onUserResizeStarted() {
        this.userResize = true;
    }
    onUserResizeFinished() {
        this.userResize = false;
        this.userResizeFinishedDelayer.run();
    }
    evacuateTail(targetGrid, startColumn) {
        for (const column of this.columns.iteratorFrom(startColumn)) {
            column.moveToGrid(targetGrid, targetGrid.getLastColumn());
        }
    }
    evacuate(targetGrid) {
        for (const column of this.columns.iterator()) {
            column.moveToGrid(targetGrid, targetGrid.getLastColumn());
        }
    }
    destroy() {
        this.userResizeFinishedDelayer.destroy();
    }
}
class ScrollPos {
    constructor(x, width) {
        this.x = x;
        this.width = width;
    }
    getLeft() {
        return this.x;
    }
    getRight() {
        return this.x + this.width;
    }
}
class ScrollView {
    constructor(world, desktop, config, layoutConfig) {
        this.config = config;
        this.world = world;
        this.scrollX = 0;
        this.desktop = desktop;
        this.grid = new Grid(this, layoutConfig);
        this.updateArea();
    }
    updateArea() {
        const newClientArea = workspace.clientArea(workspace.PlacementArea, 0, this.desktop);
        if (newClientArea === this.clientArea) {
            return;
        }
        this.clientArea = newClientArea;
        this.tilingArea = Qt.rect(newClientArea.x + this.config.marginLeft, newClientArea.y + this.config.marginTop, newClientArea.width - this.config.marginLeft - this.config.marginRight, newClientArea.height - this.config.marginTop - this.config.marginBottom);
        this.grid.onScreenSizeChanged();
        this.autoAdjustScroll();
    }
    // calculates ScrollPos that scrolls the column into view
    getScrollPosForColumn(column) {
        const left = column.getLeft();
        const right = column.getRight();
        const initialScrollPos = this.getCurrentScrollPos();
        let targetScrollX;
        if (left < initialScrollPos.getLeft()) {
            targetScrollX = this.clampScrollX(left);
        }
        else if (right > initialScrollPos.getRight()) {
            targetScrollX = this.clampScrollX(right - this.tilingArea.width);
        }
        else {
            return this.getScrollPos(this.clampScrollX(this.scrollX));
        }
        const overscroll = this.getTargetOverscroll(targetScrollX, left < initialScrollPos.getLeft());
        return this.getScrollPos(this.clampScrollX(targetScrollX + overscroll));
    }
    getTargetOverscroll(targetScrollX, scrollLeft) {
        if (this.config.overscroll === 0) {
            return 0;
        }
        const visibleColumnsWidth = this.grid.getVisibleColumnsWidth(this.getScrollPos(targetScrollX), true);
        const remainingSpace = this.tilingArea.width - visibleColumnsWidth;
        const overscrollX = Math.min(this.config.overscroll, Math.round(remainingSpace / 2));
        const direction = scrollLeft ? -1 : 1;
        return overscrollX * direction;
    }
    scrollToColumn(column) {
        this.scrollX = this.getScrollPosForColumn(column).x;
    }
    scrollCenterColumn(column) {
        const windowCenter = column.getLeft() + column.getWidth() / 2;
        const screenCenter = this.scrollX + this.tilingArea.width / 2;
        this.adjustScroll(Math.round(windowCenter - screenCenter), false);
    }
    autoAdjustScroll() {
        const focusedWindow = this.world.getFocusedWindow();
        if (focusedWindow === null) {
            this.removeOverscroll();
            return;
        }
        const column = focusedWindow.column;
        if (column.grid !== this.grid) {
            return;
        }
        this.scrollToColumn(column);
    }
    getScrollPos(scrollX) {
        return new ScrollPos(scrollX, this.tilingArea.width);
    }
    getCurrentScrollPos() {
        return this.getScrollPos(this.scrollX);
    }
    clampScrollX(x) {
        let minScroll = 0;
        let maxScroll = this.grid.getWidth() - this.tilingArea.width;
        if (maxScroll < 0) {
            const centerScroll = Math.round(maxScroll / 2);
            minScroll = centerScroll;
            maxScroll = centerScroll;
        }
        return clamp(x, minScroll, maxScroll);
    }
    setScroll(x, force) {
        this.scrollX = force ? x : this.clampScrollX(x);
    }
    applyScrollPos(scrollPos) {
        this.scrollX = scrollPos.x;
    }
    adjustScroll(dx, force) {
        this.setScroll(this.scrollX + dx, force);
    }
    removeOverscroll() {
        this.setScroll(this.scrollX, false);
    }
    arrange() {
        // TODO (optimization): only arrange visible windows
        this.updateArea();
        this.grid.arrange(this.tilingArea.x - this.scrollX);
        this.world.ensureFocusedTransientsVisible(); // TODO: refactor - call from elsewhere
    }
    onGridWidthChanged() {
        this.autoAdjustScroll();
    }
    onGridReordered() {
        this.autoAdjustScroll();
    }
    destroy() {
        this.grid.destroy();
    }
}
class Window {
    constructor(client, column) {
        this.client = client;
        this.height = client.kwinClient.frameGeometry.height;
        this.focusedState = {
            fullScreen: false,
            maximizedHorizontally: false,
            maximizedVertically: false,
        };
        this.skipArrange = false;
        this.column = column;
        column.onWindowAdded(this);
    }
    moveToColumn(targetColumn) {
        if (targetColumn === this.column) {
            return;
        }
        this.column.onWindowRemoved(this, false);
        this.column = targetColumn;
        targetColumn.onWindowAdded(this);
    }
    arrange(x, y, width, height) {
        if (this.skipArrange) {
            // window is maximized, fullscreen, or being manually resized, prevent fighting with the user
            return;
        }
        this.client.place(x, y, width, height);
        if (this.isFocused()) {
            // do this here rather than in `onFocused` to ensure it happens after placement
            // (otherwise placement may not happen at all)
            this.client.setMaximize(this.focusedState.maximizedVertically, this.focusedState.maximizedHorizontally);
            this.client.setFullScreen(this.focusedState.fullScreen);
        }
    }
    focus() {
        if (this.client.isShaded()) {
            // workaround for KWin deactivating clients when unshading immediately after activation
            this.client.setShade(false);
        }
        this.client.focus();
    }
    isFocused() {
        return this.client.isFocused();
    }
    onFocused() {
        this.column.onWindowFocused(this);
    }
    restoreToTiled() {
        if (this.isFocused()) {
            return;
        }
        this.client.setMaximize(false, false);
        this.client.setFullScreen(false);
    }
    onMaximizedChanged(horizontally, vertically) {
        const maximized = horizontally || vertically;
        this.skipArrange = maximized;
        this.client.kwinClient.keepBelow = !maximized;
        if (this.isFocused()) {
            this.focusedState.maximizedHorizontally = horizontally;
            this.focusedState.maximizedVertically = vertically;
        }
    }
    onFullScreenChanged(fullScreen) {
        this.skipArrange = fullScreen;
        if (this.isFocused()) {
            this.client.kwinClient.keepBelow = !fullScreen;
            this.focusedState.fullScreen = fullScreen;
        }
    }
    onUserResize(oldGeometry, resizeNeighborColumn) {
        const newGeometry = this.client.kwinClient.frameGeometry;
        const widthDelta = newGeometry.width - oldGeometry.width;
        const heightDelta = newGeometry.height - oldGeometry.height;
        if (widthDelta !== 0) {
            this.column.adjustWidth(widthDelta, true);
            let leftEdgeDelta = newGeometry.left - oldGeometry.left;
            const resizingLeftSide = leftEdgeDelta !== 0;
            if (resizeNeighborColumn && this.column.grid.config.resizeNeighborColumn) {
                const neighborColumn = resizingLeftSide ? this.column.grid.getPrevColumn(this.column) : this.column.grid.getNextColumn(this.column);
                if (neighborColumn !== null) {
                    const oldNeighborWidth = neighborColumn.getWidth();
                    neighborColumn.adjustWidth(-widthDelta, true);
                    if (resizingLeftSide) {
                        leftEdgeDelta -= neighborColumn.getWidth() - oldNeighborWidth;
                    }
                }
            }
            this.column.grid.container.adjustScroll(-leftEdgeDelta, true);
        }
        if (heightDelta !== 0) {
            this.column.adjustWindowHeight(this, heightDelta, newGeometry.y !== oldGeometry.y);
        }
    }
    onProgrammaticResize(oldGeometry) {
        const newGeometry = this.client.kwinClient.frameGeometry;
        this.column.setWidth(newGeometry.width, true);
    }
    destroy(passFocus) {
        this.column.onWindowRemoved(this, passFocus);
    }
}
class ClientMatcher {
    constructor(rules) {
        this.rules = rules;
    }
    matches(kwinClient) {
        const rule = this.rules.get(String(kwinClient.resourceClass));
        if (rule === undefined) {
            return false;
        }
        return rule.test(kwinClient.caption);
    }
}
class WindowRuleEnforcer {
    constructor(world, windowRules) {
        const [mapFloat, mapTile] = createWindowRuleMaps(windowRules);
        this.preferFloating = new ClientMatcher(mapFloat);
        this.preferTiling = new ClientMatcher(mapTile);
        this.followCaption = new Set([...mapFloat.keys(), ...mapTile.keys()]);
    }
    shouldTile(kwinClient) {
        return Clients.canTileNow(kwinClient) && (this.preferTiling.matches(kwinClient) ||
            kwinClient.normalWindow && kwinClient.managed && !this.preferFloating.matches(kwinClient));
    }
    initClientSignalManager(world, kwinClient) {
        if (!this.followCaption.has(kwinClient.resourceClass)) {
            return null;
        }
        const enforcer = this;
        const manager = new SignalManager();
        manager.connect(kwinClient.captionChanged, () => {
            const shouldTile = enforcer.shouldTile(kwinClient);
            if (shouldTile) {
                world.tileClient(kwinClient);
            }
            else {
                world.untileClient(kwinClient);
            }
        });
        return manager;
    }
}
function createWindowRuleMaps(windowRules) {
    const mapFloat = new Map();
    const mapTile = new Map();
    for (const windowRule of windowRules) {
        const map = windowRule.tile ? mapTile : mapFloat;
        let captions = map.get(windowRule.class);
        if (captions === undefined) {
            captions = [];
            map.set(windowRule.class, captions);
        }
        if (windowRule.caption !== undefined) {
            captions.push(windowRule.caption);
        }
    }
    return [
        createWindowRuleRegexMap(mapFloat),
        createWindowRuleRegexMap(mapTile),
    ];
}
function createWindowRuleRegexMap(windowRuleMap) {
    const regexMap = new Map;
    for (const [k, v] of windowRuleMap) {
        regexMap.set(k, joinRegexes(v));
    }
    return regexMap;
}
function joinRegexes(regexes) {
    if (regexes.length == 0) {
        return new RegExp("");
    }
    if (regexes.length == 1) {
        return new RegExp("^" + regexes[0] + "$");
    }
    const joinedRegexes = regexes.map(wrapParens).join("|");
    return new RegExp("^" + joinedRegexes + "$");
}
function wrapParens(str) {
    return "(" + str + ")";
}
class Delayer {
    constructor(delay, f) {
        this.timer = initQmlTimer();
        this.timer.interval = delay;
        this.timer.triggered.connect(f);
    }
    run() {
        this.timer.restart();
    }
    destroy() {
        this.timer.destroy();
    }
}
function initQmlTimer() {
    return Qt.createQmlObject(`import QtQuick 2.15
        Timer {}`, qmlBase);
}
class Doer {
    constructor() {
        this.nCalls = 0;
    }
    do(f) {
        this.nCalls++;
        f();
        this.nCalls--;
    }
    isDoing() {
        return this.nCalls > 0;
    }
}
class LinkedList {
    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.itemMap = new Map();
    }
    getNode(item) {
        const node = this.itemMap.get(item);
        if (node === undefined) {
            throw new Error("item not in list");
        }
        return node;
    }
    insertBefore(item, nextItem) {
        const nextNode = this.getNode(nextItem);
        this.insert(item, nextNode.prev, nextNode);
    }
    insertAfter(item, prevItem) {
        const prevNode = this.getNode(prevItem);
        this.insert(item, prevNode, prevNode.next);
    }
    insertStart(item) {
        this.insert(item, null, this.firstNode);
    }
    insertEnd(item) {
        this.insert(item, this.lastNode, null);
    }
    insert(item, prevNode, nextNode) {
        const node = new LinkedListNode(item);
        this.itemMap.set(item, node);
        this.insertNode(node, prevNode, nextNode);
    }
    insertNode(node, prevNode, nextNode) {
        node.prev = prevNode;
        node.next = nextNode;
        if (nextNode !== null) {
            console.assert(nextNode.prev === prevNode);
            nextNode.prev = node;
        }
        if (prevNode !== null) {
            console.assert(prevNode.next === nextNode);
            prevNode.next = node;
        }
        if (this.firstNode === nextNode) {
            this.firstNode = node;
        }
        if (this.lastNode === prevNode) {
            this.lastNode = node;
        }
    }
    getPrev(item) {
        const prevNode = this.getNode(item).prev;
        return prevNode === null ? null : prevNode.item;
    }
    getNext(item) {
        const nextNode = this.getNode(item).next;
        return nextNode === null ? null : nextNode.item;
    }
    getFirst() {
        if (this.firstNode === null) {
            return null;
        }
        return this.firstNode.item;
    }
    getLast() {
        if (this.lastNode === null) {
            return null;
        }
        return this.lastNode.item;
    }
    getItemAtIndex(index) {
        let node = this.firstNode;
        if (node === null) {
            return null;
        }
        for (let i = 0; i < index; i++) {
            node = node.next;
            if (node === null) {
                return null;
            }
        }
        return node.item;
    }
    remove(item) {
        const node = this.getNode(item);
        this.itemMap.delete(item);
        this.removeNode(node);
    }
    removeNode(node) {
        const prevNode = node.prev;
        const nextNode = node.next;
        if (prevNode !== null) {
            prevNode.next = nextNode;
        }
        if (nextNode !== null) {
            nextNode.prev = prevNode;
        }
        if (this.firstNode === node) {
            this.firstNode = nextNode;
        }
        if (this.lastNode === node) {
            this.lastNode = prevNode;
        }
    }
    contains(item) {
        return this.itemMap.has(item);
    }
    swap(node0, node1) {
        console.assert(node0.next === node1 && node1.prev === node0);
        const prevNode = node0.prev;
        const nextNode = node1.next;
        if (prevNode !== null) {
            prevNode.next = node1;
        }
        node1.next = node0;
        node0.next = nextNode;
        if (nextNode !== null) {
            nextNode.prev = node0;
        }
        node0.prev = node1;
        node1.prev = prevNode;
        if (this.firstNode === node0) {
            this.firstNode = node1;
        }
        if (this.lastNode === node1) {
            this.lastNode = node0;
        }
    }
    move(item, prevItem) {
        const node = this.getNode(item);
        this.removeNode(node);
        if (prevItem === null) {
            this.insertNode(node, null, this.firstNode);
        }
        else {
            const prevNode = this.getNode(prevItem);
            this.insertNode(node, prevNode, prevNode.next);
        }
    }
    moveBack(item) {
        const node = this.getNode(item);
        if (node.prev !== null) {
            console.assert(node !== this.firstNode);
            this.swap(node.prev, node);
        }
    }
    moveForward(item) {
        const node = this.getNode(item);
        if (node.next !== null) {
            console.assert(node !== this.lastNode);
            this.swap(node, node.next);
        }
    }
    length() {
        return this.itemMap.size;
    }
    *iterator() {
        for (let node = this.firstNode; node !== null; node = node.next) {
            yield node.item;
        }
    }
    *iteratorFrom(startItem) {
        for (let node = this.getNode(startItem); node !== null; node = node.next) {
            yield node.item;
        }
    }
}
// TODO (optimization): reuse nodes
class LinkedListNode {
    constructor(item) {
        this.item = item;
        this.prev = null;
        this.next = null;
    }
}
class SignalManager {
    constructor() {
        this.connections = [];
    }
    connect(signal, handler) {
        signal.connect(handler);
        this.connections.push({ signal: signal, handler: handler });
    }
    destroy() {
        for (const connection of this.connections) {
            connection.signal.disconnect(connection.handler);
        }
        this.connections = [];
    }
}
function clamp(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}
function rectEqual(a, b) {
    return a.x === b.x &&
        a.y === b.y &&
        a.width === b.width &&
        a.height === b.height;
}
class ClientStateDocked {
    constructor(world, kwinClient) {
        this.world = world;
        this.signalManager = ClientStateDocked.initSignalManager(world, kwinClient);
        world.onScreenResized();
    }
    destroy(passFocus) {
        this.signalManager.destroy();
        this.world.onScreenResized();
    }
    static initSignalManager(world, kwinClient) {
        const manager = new SignalManager();
        manager.connect(kwinClient.frameGeometryChanged, (kwinClient, oldGeometry) => {
            world.onScreenResized();
        });
        return manager;
    }
}
class ClientStateManager {
    constructor(initialState) {
        this.state = initialState;
    }
    setState(newState, passFocus) {
        this.state.destroy(passFocus);
        this.state = newState;
    }
    getState() {
        return this.state;
    }
    destroy(passFocus) {
        this.state.destroy(passFocus);
    }
}
class ClientStateTiledMinimized {
    destroy(passFocus) { }
}
class ClientStateFloating {
    destroy(passFocus) { }
}
class ClientStateTiled {
    constructor(world, client) {
        client.prepareForTiling();
        const grid = world.getClientGrid(client.kwinClient);
        const column = new Column(grid, grid.getLastFocusedColumn() ?? grid.getLastColumn());
        const window = new Window(client, column);
        grid.container.arrange();
        this.window = window;
        this.signalManager = ClientStateTiled.initSignalManager(world, window);
    }
    destroy(passFocus) {
        this.signalManager.destroy();
        const window = this.window;
        const grid = window.column.grid;
        const clientWrapper = window.client;
        window.destroy(passFocus);
        grid.container.arrange();
        clientWrapper.prepareForFloating(grid.container.clientArea);
    }
    static initSignalManager(world, window) {
        const client = window.client;
        const kwinClient = client.kwinClient;
        const manager = new SignalManager();
        manager.connect(kwinClient.desktopChanged, () => {
            if (kwinClient.desktop === -1) {
                // windows on all desktops are not supported
                world.untileClient(kwinClient);
                return;
            }
            ClientStateTiled.moveWindowToCorrectGrid(world, window);
        });
        manager.connect(kwinClient.activitiesChanged, (kwinClient) => {
            if (kwinClient.activities.length !== 1) {
                // windows on multiple activities are not supported
                world.untileClient(kwinClient);
                return;
            }
            ClientStateTiled.moveWindowToCorrectGrid(world, window);
        });
        let lastResize = false;
        manager.connect(kwinClient.moveResizedChanged, () => {
            if (world.untileOnDrag && kwinClient.move) {
                world.untileClient(kwinClient);
                return;
            }
            const grid = window.column.grid;
            const resize = kwinClient.resize;
            if (!lastResize && resize) {
                grid.onUserResizeStarted();
            }
            if (lastResize && !resize) {
                grid.onUserResizeFinished();
            }
            lastResize = resize;
        });
        let cursorChangedAfterResizeStart = false;
        manager.connect(kwinClient.moveResizeCursorChanged, () => {
            cursorChangedAfterResizeStart = true;
        });
        manager.connect(kwinClient.clientStartUserMovedResized, () => {
            cursorChangedAfterResizeStart = false;
        });
        manager.connect(kwinClient.frameGeometryChanged, (kwinClient, oldGeometry) => {
            const scrollView = window.column.grid.container;
            if (kwinClient.resize) {
                window.onUserResize(oldGeometry, !cursorChangedAfterResizeStart);
                scrollView.arrange();
            }
            else {
                const maximized = rectEqual(kwinClient.frameGeometry, scrollView.clientArea);
                if (!client.isManipulatingGeometry() && !kwinClient.fullScreen && !maximized) {
                    window.onProgrammaticResize(oldGeometry);
                    scrollView.arrange();
                }
            }
        });
        return manager;
    }
    static moveWindowToCorrectGrid(world, window) {
        const kwinClient = window.client.kwinClient;
        const oldGrid = window.column.grid;
        const newGrid = world.getClientGrid(kwinClient);
        if (oldGrid === newGrid) {
            // window already on the correct grid
            return;
        }
        const newColumn = new Column(newGrid, newGrid.getLastFocusedColumn() ?? newGrid.getLastColumn());
        window.moveToColumn(newColumn);
        oldGrid.container.arrange();
        newGrid.container.arrange();
    }
}
class ClientWrapper {
    constructor(kwinClient, initialState, transientFor, rulesSignalManager) {
        this.kwinClient = kwinClient;
        this.stateManager = new ClientStateManager(initialState);
        this.transientFor = transientFor;
        this.transients = [];
        if (transientFor !== null) {
            transientFor.addTransient(this);
        }
        this.signalManager = ClientWrapper.initSignalManager(this);
        this.rulesSignalManager = rulesSignalManager;
        this.preferredWidth = kwinClient.frameGeometry.width;
        this.manipulatingGeometry = new Doer();
    }
    place(x, y, width, height) {
        this.manipulatingGeometry.do(() => {
            if (this.kwinClient.resize) {
                // window is being manually resized, prevent fighting with the user
                return;
            }
            this.kwinClient.frameGeometry = Qt.rect(x, y, width, height);
        });
    }
    moveTransient(dx, dy) {
        // TODO: prevent moving off the grid
        if (this.stateManager.getState() instanceof ClientStateFloating) {
            const frame = this.kwinClient.frameGeometry;
            this.kwinClient.frameGeometry = Qt.rect(frame.x + dx, frame.y + dy, frame.width, frame.height);
            for (const transient of this.transients) {
                transient.moveTransient(dx, dy);
            }
        }
    }
    focus() {
        workspace.activeClient = this.kwinClient;
    }
    isFocused() {
        return workspace.activeClient === this.kwinClient;
    }
    setMaximize(horizontally, vertically) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.setMaximize(vertically, horizontally);
        });
    }
    setFullScreen(fullScreen) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.fullScreen = fullScreen;
        });
    }
    setShade(shade) {
        this.manipulatingGeometry.do(() => {
            this.kwinClient.shade = shade;
        });
    }
    isShaded() {
        return this.kwinClient.shade;
    }
    isManipulatingGeometry() {
        return this.manipulatingGeometry.isDoing();
    }
    prepareForTiling() {
        this.kwinClient.keepBelow = true;
        this.setFullScreen(false);
        this.setMaximize(false, false);
    }
    prepareForFloating(screenSize) {
        this.kwinClient.keepBelow = false;
        this.setShade(false);
        this.setFullScreen(false);
        this.setMaximize(false, false);
        const clientRect = this.kwinClient.frameGeometry;
        const width = this.preferredWidth;
        this.place(clamp(clientRect.x, screenSize.left, screenSize.right - width), clientRect.y, width, Math.min(clientRect.height, Math.round(screenSize.height / 2)));
    }
    addTransient(transient) {
        this.transients.push(transient);
    }
    removeTransient(transient) {
        const i = this.transients.indexOf(transient);
        this.transients.splice(i, 1);
    }
    ensureTransientsVisible(screenSize) {
        for (const transient of this.transients) {
            if (transient.stateManager.getState() instanceof ClientStateFloating) {
                transient.ensureVisible(screenSize);
                transient.ensureTransientsVisible(screenSize);
            }
        }
    }
    ensureVisible(screenSize) {
        const frame = this.kwinClient.frameGeometry;
        if (frame.left < 0) {
            frame.x = 0;
        }
        else if (frame.right > screenSize.width) {
            frame.x = screenSize.width - frame.width;
        }
    }
    destroy(passFocus) {
        this.stateManager.destroy(passFocus);
        this.signalManager.destroy();
        if (this.rulesSignalManager !== null) {
            this.rulesSignalManager.destroy();
        }
        if (this.transientFor !== null) {
            this.transientFor.removeTransient(this);
        }
        for (const transient of this.transients) {
            transient.transientFor = null;
        }
    }
    static initSignalManager(client) {
        const manager = new SignalManager();
        manager.connect(client.kwinClient.frameGeometryChanged, (kwinClient, oldGeometry) => {
            if (client.stateManager.getState() instanceof ClientStateTiled) {
                const newGeometry = client.kwinClient.frameGeometry;
                const oldCenterX = oldGeometry.x + oldGeometry.width / 2;
                const oldCenterY = oldGeometry.y + oldGeometry.height / 2;
                const newCenterX = newGeometry.x + newGeometry.width / 2;
                const newCenterY = newGeometry.y + newGeometry.height / 2;
                const dx = Math.round(newCenterX - oldCenterX);
                const dy = Math.round(newCenterY - oldCenterY);
                for (const transient of client.transients) {
                    transient.moveTransient(dx, dy);
                }
            }
        });
        return manager;
    }
}
var Clients;
(function (Clients) {
    function canTileEver(kwinClient) {
        return kwinClient.resizeable;
    }
    Clients.canTileEver = canTileEver;
    function canTileNow(kwinClient) {
        return canTileEver(kwinClient) && !kwinClient.minimized && kwinClient.desktop > 0 && kwinClient.activities.length === 1;
    }
    Clients.canTileNow = canTileNow;
    function makeTileable(kwinClient) {
        if (kwinClient.minimized) {
            kwinClient.minimized = false;
        }
        if (kwinClient.desktop <= 0) {
            kwinClient.desktop = workspace.currentDesktop;
        }
        if (kwinClient.activities.length !== 1) {
            kwinClient.activities = [workspace.currentActivity];
        }
    }
    Clients.makeTileable = makeTileable;
})(Clients || (Clients = {}));
class ScrollViewManager {
    constructor(world, config, layoutConfig, currentActivity, nDesktops) {
        this.config = config;
        this.layoutConfig = layoutConfig;
        this.world = world;
        this.scrollViewsPerActivity = new Map();
        this.nDesktops = 0;
        this.setNDesktops(nDesktops);
        this.addActivity(currentActivity);
    }
    get(activity, desktopNumber) {
        const desktopIndex = desktopNumber - 1;
        if (desktopIndex >= this.nDesktops || this.nDesktops < 0) {
            throw new Error("invalid desktop number: " + String(desktopNumber));
        }
        if (!this.scrollViewsPerActivity.has(activity)) {
            this.addActivity(activity);
        }
        return this.scrollViewsPerActivity.get(activity)[desktopIndex];
    }
    setNDesktops(nDesktops) {
        if (nDesktops > this.nDesktops) {
            this.addDesktopsToActivities(nDesktops - this.nDesktops);
        }
        else if (nDesktops < this.nDesktops) {
            this.removeDesktopsFromActivities(this.nDesktops - nDesktops);
        }
        this.nDesktops = nDesktops;
    }
    addDesktopsToActivities(n) {
        for (const scrollViews of this.scrollViewsPerActivity.values()) {
            this.addDesktops(scrollViews, n);
        }
    }
    addDesktops(scrollViews, n) {
        const nStart = scrollViews.length;
        for (let i = 0; i < n; i++) {
            const desktopNumber = nStart + i + 1;
            scrollViews.push(new ScrollView(this.world, desktopNumber, this.config, this.layoutConfig));
        }
    }
    removeDesktopsFromActivities(n) {
        const lastRemainingDesktopIndex = this.nDesktops - n - 1;
        for (const scrollViews of this.scrollViewsPerActivity.values()) {
            const targetScrollView = scrollViews[lastRemainingDesktopIndex];
            for (let i = 0; i < n; i++) {
                const removedScrollView = scrollViews.pop();
                removedScrollView.grid.evacuate(targetScrollView.grid);
            }
        }
    }
    addActivity(activity) {
        const scrollViews = [];
        this.addDesktops(scrollViews, this.nDesktops);
        this.scrollViewsPerActivity.set(activity, scrollViews);
    }
    removeActivity(activity) {
        const removedScrollViews = this.scrollViewsPerActivity.get(activity);
        this.scrollViewsPerActivity.delete(activity);
        const targetActivityScrollViews = this.scrollViewsPerActivity.values().next().value;
        for (let i = 0; i < removedScrollViews.length; i++) {
            removedScrollViews[i].grid.evacuate(targetActivityScrollViews[i]);
        }
    }
    *scrollViews() {
        for (const scrollViews of this.scrollViewsPerActivity.values()) {
            for (const scrollView of scrollViews) {
                yield scrollView;
            }
        }
    }
}
class World {
    constructor(config) {
        this.untileOnDrag = config.untileOnDrag;
        this.clientMap = new Map();
        this.lastFocusedClient = null;
        this.workspaceSignalManager = initWorkspaceSignalHandlers(this);
        let parsedWindowRules = [];
        try {
            parsedWindowRules = JSON.parse(config.windowRules);
        }
        catch (error) {
            console.log("failed to parse windowRules:", error);
        }
        this.windowRuleEnforcer = new WindowRuleEnforcer(this, parsedWindowRules);
        this.screenResizedDelayer = new Delayer(1000, () => {
            // this delay ensures that docks get taken into account by `workspace.clientArea`
            const gridManager = this.scrollViewManager; // workaround for bug in Qt5's JS engine
            for (const scrollView of gridManager.scrollViews()) {
                scrollView.arrange();
            }
        });
        this.scrollViewManager = new ScrollViewManager(this, {
            marginTop: config.gapsOuterTop,
            marginBottom: config.gapsOuterBottom,
            marginLeft: config.gapsOuterLeft,
            marginRight: config.gapsOuterRight,
            overscroll: config.overscroll,
        }, config, workspace.currentActivity, workspace.desktops);
        this.addExistingClients();
    }
    updateDesktops() {
        this.scrollViewManager.setNDesktops(workspace.desktops);
    }
    addExistingClients() {
        const kwinClients = workspace.clientList();
        for (let i = 0; i < kwinClients.length; i++) {
            const kwinClient = kwinClients[i];
            this.addClient(kwinClient);
        }
    }
    getGrid(activity, desktopNumber) {
        console.assert(desktopNumber > 0 && desktopNumber <= workspace.desktops);
        return this.scrollViewManager.get(activity, desktopNumber).grid;
    }
    getGridInCurrentActivity(desktopNumber) {
        return this.getGrid(workspace.currentActivity, desktopNumber);
    }
    getCurrentGrid() {
        return this.getGrid(workspace.currentActivity, workspace.currentDesktop);
    }
    getClientGrid(kwinClient) {
        console.assert(kwinClient.activities.length === 1);
        return this.getGrid(kwinClient.activities[0], kwinClient.desktop);
    }
    addClient(kwinClient) {
        const client = new ClientWrapper(kwinClient, new ClientStateFloating(), this.findTransientFor(kwinClient), this.windowRuleEnforcer.initClientSignalManager(this, kwinClient));
        this.clientMap.set(kwinClient, client);
        if (kwinClient.dock) {
            client.stateManager.setState(new ClientStateDocked(this, kwinClient), false);
        }
        else if (this.windowRuleEnforcer.shouldTile(kwinClient)) {
            client.stateManager.setState(new ClientStateTiled(this, client), false);
        }
    }
    removeClient(kwinClient, passFocus) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        client.destroy(passFocus && kwinClient === this.lastFocusedClient);
        this.clientMap.delete(kwinClient);
    }
    findTransientFor(kwinClient) {
        if (!kwinClient.transient) {
            return null;
        }
        const transientFor = this.clientMap.get(kwinClient.transientFor);
        if (transientFor === undefined) {
            return null;
        }
        return transientFor;
    }
    ensureFocusedTransientsVisible() {
        this.doIfTiledFocused(true, (window, column, grid) => {
            window.client.ensureTransientsVisible(grid.container.clientArea);
        });
    }
    minimizeClient(kwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiled) {
            client.stateManager.setState(new ClientStateTiledMinimized(), kwinClient === this.lastFocusedClient);
        }
    }
    unminimizeClient(kwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiledMinimized) {
            client.stateManager.setState(new ClientStateTiled(this, client), false);
        }
    }
    tileClient(kwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiled) {
            return;
        }
        client.stateManager.setState(new ClientStateTiled(this, client), false);
    }
    untileClient(kwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        if (client.stateManager.getState() instanceof ClientStateTiled) {
            client.stateManager.setState(new ClientStateFloating(), false);
        }
    }
    toggleFloatingClient(kwinClient) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientStateFloating && Clients.canTileEver(kwinClient)) {
            Clients.makeTileable(kwinClient);
            client.stateManager.setState(new ClientStateTiled(this, client), false);
        }
        else if (clientState instanceof ClientStateTiled) {
            client.stateManager.setState(new ClientStateFloating(), false);
        }
    }
    hasClient(kwinClient) {
        return this.clientMap.has(kwinClient);
    }
    onClientFocused(kwinClient) {
        this.lastFocusedClient = kwinClient;
    }
    doIfTiledInner(client, followTransient, f) {
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientStateTiled) {
            const window = clientState.window;
            const column = window.column;
            const grid = column.grid;
            f(window, column, grid);
        }
        else if (followTransient && client.transientFor !== null) {
            this.doIfTiledInner(client.transientFor, true, f);
        }
    }
    doIfTiled(kwinClient, followTransient, f) {
        const client = this.clientMap.get(kwinClient);
        if (client === undefined) {
            return;
        }
        this.doIfTiledInner(client, followTransient, f);
    }
    doIfTiledFocused(followTransient, f) {
        this.doIfTiled(workspace.activeClient, followTransient, f);
    }
    getFocusedWindow() {
        const activeClient = workspace.activeClient;
        if (activeClient === null) {
            return null;
        }
        const client = this.clientMap.get(activeClient);
        if (client === undefined) {
            return null;
        }
        const clientState = client.stateManager.getState();
        if (clientState instanceof ClientStateTiled) {
            return clientState.window;
        }
        else {
            return null;
        }
    }
    removeAllClients() {
        for (const kwinClient of Array.from(this.clientMap.keys())) {
            this.removeClient(kwinClient, false);
        }
    }
    destroy() {
        this.workspaceSignalManager.destroy();
        this.removeAllClients();
        for (const scrollView of this.scrollViewManager.scrollViews()) {
            scrollView.destroy();
        }
    }
    onScreenResized() {
        this.screenResizedDelayer.run();
    }
}
