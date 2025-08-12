import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'svg[icon]',
  standalone: true,
})
export class SvgIconDirective implements OnInit {
  @Input() icon!: string;

  constructor(private el: ElementRef<SVGSVGElement>) {}

  ngOnInit(): void {
    const svg = this.el.nativeElement;
    svg.innerHTML = '';

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS(null, 'href', '/assets/svg/sprite.svg#' + this.icon);

    svg.appendChild(use);
    svg.removeAttribute('icon');
  }
}