import { Component, Input, ContentChild, ElementRef, TemplateRef } from "@angular/core";

@Component({
    selector: 'poke-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
    @ContentChild('accordionTitle') accordionTitle: TemplateRef<ElementRef>;
    @ContentChild('accordionBody') accordionBody: TemplateRef<ElementRef>;

    isOpen = false;

    toggle() {
        this.isOpen = !this.isOpen;
    }
}
