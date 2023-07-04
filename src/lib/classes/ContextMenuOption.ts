export class ContextMenuItem {
    name: string;
    icon: string | null;
    constructor(name: string, icon: string | null = null) {
        this.name = name;
        this.icon = icon;
    }
}

export default class ContextAction extends ContextMenuItem {
    action: () => void;
    constructor(name: string, icon: string | null = null, action: () => void) {
        super(name, icon);
        this.action = action;
    }
}

export class LinkAction extends ContextMenuItem {
    href: string;
    constructor(name: string, icon: string | null = null, href: string) {
        super(name, icon);
        this.href = href;
    }
}

export class ToogleAction extends ContextMenuItem {
    isSet: boolean;

    constructor(name: string, icon: string | null = null, isSet: boolean) {
        super(name, icon);
        this.isSet = isSet;
    }
}