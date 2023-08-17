import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: "[clickStopPropagation]"
})
export class ClickStopPropagationDirective {

    @HostListener("click", ["$event"])
    public onClick(event: Event): void {
        console.log(event);
        
        // event.stopPropagation();
    }

}