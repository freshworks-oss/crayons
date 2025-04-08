import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  h,
} from '@stencil/core';
import { Draggable } from '../../utils/draggable';

@Component({
  tag: 'fw-drag-container',
  styleUrl: 'drag-container.scss',
})
export class DragContainer {
  @Element() host: HTMLElement;
  private containerInstance: Draggable;

  /**
   * Id of the fw-sortable element from which draggable content can be accepted. Add comma separated id's for multiple containers.
   */
  @Prop() acceptFrom = '';
  /**
   * Whether the drag element should be added to the container on drop. If set to false, the placeholder will be retained.
   */
  @Prop() addOnDrop = true;
  /**
   * Whether the drag element should be moved or copied.
   */
  @Prop() copy = true;
  /**
   * The class name for the drag/drop placeholder. Add space separated class names for multiple classes
   */
  @Prop() placeholderClass = '';
  /**
   * Whether the list should be sortable.
   */
  @Prop() sortable = true;

  /**
   * flag to support dependentFields & Multi select dropdown within sections
   */
  @Prop() supportDependentAndMSDDInSections = false;

  /**
   * Triggered when a draggable item is dropped inside the container.
   */
  @Event() fwDrop: EventEmitter<void>;

  /**
   * Triggered when a draggable item enters the container.
   */
  @Event() fwDragEnter: EventEmitter<void>;

  /**
   * Triggered when a draggable item leaves the container.
   */
  @Event() fwDragLeave: EventEmitter<void>;

  componentWillLoad() {
    this.containerInstance = new Draggable(this.host, {
      acceptFrom: this.acceptFrom,
      addOnDrop: this.addOnDrop,
      copy: this.copy,
      placeholderClass: this.placeholderClass,
      sortable: this.sortable,
      supportDependentAndMSDDInSections: this.supportDependentAndMSDDInSections,
    });

    this.host.addEventListener('fwDropBase', this.emitFwDrop.bind(this));
    this.host.addEventListener(
      'fwDragEnterBase',
      this.emitDragEnter.bind(this)
    );
    this.host.addEventListener(
      'fwDragLeaveBase',
      this.emitDragLeave.bind(this)
    );
  }

  emitFwDrop(ev) {
    this.fwDrop.emit(ev['detail']);
  }

  emitDragEnter(ev) {
    this.fwDragEnter.emit(ev['detail']); // Emit fwDragEnter event
  }

  emitDragLeave(ev) {
    this.fwDragLeave.emit(ev); // Emit fwDragLeave event
  }

  disconnectedCallback() {
    this.containerInstance?.destroy();
    this.host.removeEventListener('fwDropBase', this.emitFwDrop);
    this.host.removeEventListener('fwDragEnterBase', this.emitDragEnter);
    this.host.removeEventListener('fwDragLeaveBase', this.emitDragLeave);
  }

  render() {
    return <Host class='drag-container'></Host>;
  }
}
