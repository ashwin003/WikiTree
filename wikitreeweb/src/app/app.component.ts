import { Component, OnInit } from '@angular/core';
import { INode } from './models/node';
import { Subject } from 'rxjs';
import { WikiService } from './services/wiki.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading = false;
  slug: String = '';

  links = [
    { id: 'a', source: 'first', target: 'second', label: 'is parent of' },
    { id: 'b', source: 'first', target: 'third', label: 'custom label' },
  ];

  nodes = [
    { id: 'first', label: 'A' },
    { id: 'second', label: 'B' },
    { id: 'third', label: 'C' },
  ];

  width = window.innerWidth * 0.75;
  height = window.innerHeight * 0.5;

  zoomToFit$: Subject<boolean> = new Subject();

  constructor(private wikiService: WikiService) {}

  ngOnInit() {
    this.nodes = [];
    this.links = [];
  }
  onNodeSelect(event: any) {
    const currentNode = { id: event.id, label: event.label };
    this.getFromWikipedia(event.id, currentNode);
  }

  onClick(slug: string): void {
    if (slug) {
      const slugNode = { id: slug, label: slug };
      if (!this.isNodePresent(slug)) {
        this.addToNodes(slugNode);

        this.getFromWikipedia(slug, slugNode);
      }
    }
  }

  onRedraw() {
    this.nodes = [...this.nodes];
    this.links = [...this.links];
  }

  getFromWikipedia(slug: string, slugNode: any): void {
    this.isLoading = true;
    this.wikiService.getNextNode(slug).subscribe((node) => {
      this.isLoading = false;
      this.addNode(node, slugNode);
    }, (err) => {
      this.isLoading = false;
      console.error(err);
    });
  }

  addNode(newNode: INode, currentNode: any) {
    this.addToNodes({
      id: newNode.slug,
      label: newNode.text,
    });

    this.addToLinks({
      id: newNode.slug + 'link',
      source: currentNode.id,
      target: newNode.slug,
    });

    this.zoomToFit$.next(true);
  }

  addToNodes(node: any) {
    if (!this.isNodePresent(node.id)) {
      this.nodes.push(node);
      this.nodes = [...this.nodes];
    }
  }

  addToLinks(link: any) {
    if (!this.isLinkPresent(link)) {
      this.links.push(link);
      this.links = [...this.links];
    }
  }

  isNodePresent(slug: string): boolean {
    const isPresent = !!this.nodes.find((value) => value.id === slug);
    return isPresent;
  }

  isLinkPresent(link: any): boolean {
    const isPresent = !!this.links.find((value) => value.id === link.id && value.source === link.source && value.target === link.target);
    return isPresent;
  }
}
