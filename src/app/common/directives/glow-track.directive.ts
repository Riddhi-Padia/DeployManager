import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  NgZone
} from '@angular/core';

@Directive({
  selector: '[appGlowTrack]'
})
export class GlowTrackDirective implements OnInit {
  private spans: HTMLElement[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2, private zone: NgZone) {}

  ngOnInit() {
    this.wrapTextNodes(this.el.nativeElement);
    this.zone.runOutsideAngular(() => this.trackCursor());
  }

  private wrapTextNodes(element: HTMLElement) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) =>
          node.parentElement &&
          node.textContent?.trim()?.length &&
          !(node.parentElement instanceof HTMLScriptElement)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
      }
    );

    const textNodes: Text[] = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }

    for (const textNode of textNodes) {
      const characters = textNode.textContent!.split('');
      const fragment = document.createDocumentFragment();

      for (const char of characters) {
        const span = this.renderer.createElement('span');
        span.innerText = char;
        span.style.display = 'inline-block';
        this.renderer.appendChild(fragment, span);
        this.spans.push(span);
      }

      textNode.parentNode?.replaceChild(fragment, textNode);
    }
  }

  private trackCursor() {
    document.addEventListener('mousemove', (e) => {
      const radius = 10;

      for (const span of this.spans) {
        const rect = span.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          span.style.color = '#7965C1';
          span.style.cursor = 'none';
        } else {
          span.style.color = '';
        }
      }
    });
  }
}
