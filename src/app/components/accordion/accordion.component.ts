import { Component, Input, Output, ContentChild, ElementRef, EventEmitter, TemplateRef } from "@angular/core";

@Component({
    selector: 'poke-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
    @ContentChild('accordionTitle') accordionTitle: TemplateRef<ElementRef>;
    @ContentChild('accordionBody') accordionBody: TemplateRef<ElementRef>;

    @Input() highlightClass: any;

    @Output()
    titleLeftClicked = new EventEmitter<void>();

    @Output()
    titleRightClicked = new EventEmitter<void>();

    isOpen = false;

    toggle = this._toggle.bind(this);

    private _toggle() {
        this.isOpen = !this.isOpen;
    }

    onTitleLeftClick(event?: any) {
        if (event) {
            if (![...event?.target?.classList].includes('accordion-title')) {
                return;
            }
        }
        this.titleLeftClicked.emit();
        this.toggle();
    }

    onTitleRightClick(event?: any) {
        if (event) {
            if (![...event?.target?.classList].includes('accordion-title')) {
                return;
            }
        }
        event.preventDefault();
        this.titleRightClicked.emit();
    }
}
