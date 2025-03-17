import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from '../App';

@Component({
  selector: 'app-react-wrapper',
  template: '<div #reactComponentContainer></div>',
})
export class ReactWrapperComponent implements AfterViewInit, OnDestroy {
  @Input() name: string;
  @Input() backendUrl: string = 'http://localhost:5000'; // Default backend URL
  @ViewChild('reactComponentContainer') reactComponentContainer!: ElementRef;
  private root: Root | null = null; // Store the root reference

  ngAfterViewInit(): void {
    this.renderReactComponent();
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.unmount(); // Unmount the React component
      this.root = null; // Clear the root reference
    }
  }

  private renderReactComponent() {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined') {
      if (!this.root) {
        // Create a new root only if it doesn't exist
        this.root = createRoot(this.reactComponentContainer.nativeElement);
      }

      const props = { name: this.name, backendUrl: this.backendUrl }; // Prepare props for the React component
      this.root.render(React.createElement(App, props)); // Use existing root to render
    }
  }
}
