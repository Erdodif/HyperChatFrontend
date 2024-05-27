import arrowLeft from "$lib/assets/icons/arrow-left.svg";
import arrowRight from "$lib/assets/icons/arrow-right.svg";

export class ContextMenuItem {
    name: string;
    icon: string | null;
    center: boolean;

    constructor(name: string, icon: string | null = null, center: boolean = false) {
        this.name = name;
        this.icon = icon;
        this.center = center;
    }
}

export default class ButtonAction extends ContextMenuItem {
    action: () => void;
    autoClose: boolean;

    constructor(name: string, action: () => void, icon: string | null = null, center: boolean = false, autoClose: boolean = true) {
        super(name, icon, center);
        this.action = action;
        this.autoClose = autoClose;
    }
}

export class LinkAction extends ContextMenuItem {
    href: string;
    newTab: boolean;
    constructor(name: string, href: string, icon: string | null = null, center: boolean = false, newTab = false) {
        super(name, icon, center);
        this.href = href;
        this.newTab = newTab;
    }
}

export class ToogleAction extends ContextMenuItem {
    isSet: boolean;
    isFor: string;

    constructor(name: string, isFor: string, isSet: boolean, icon: string | null = null, center: boolean = false) {
        super(name, icon, center);
        this.isFor = isFor;
        this.isSet = isSet;
    }
}

export class Expandable extends ContextMenuItem {
    options: ContextMenuItem[];
    expanded: boolean;

    constructor(name: string, options: ContextMenuItem[]) {
        super(name, arrowRight);
        this.options = options;
        this.expanded = false;
    }

    close() {
        this.icon = arrowRight;
        this.expanded = false;
    }

    open() {
        this.icon = arrowLeft;
        this.expanded = true;
    }
}
