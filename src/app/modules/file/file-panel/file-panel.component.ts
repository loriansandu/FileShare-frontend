import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FileDetails} from "../models/FileDetails";
import {formatUploadDate, getFileSize} from '../utils'
import {format, parseISO} from "date-fns";
import {Tooltip} from "primeng/tooltip";


@Component({
  selector: 'app-file-panel',
  templateUrl: './file-panel.component.html',
  styleUrls: ['./file-panel.component.css']
})
export class FilePanelComponent implements OnChanges{
  @Input() uploadResponse: FileDetails | undefined;
  @Output() downloadFile = new EventEmitter<string>;
  @Output() deleteFile = new EventEmitter<string>;
  deleteFileDialog: boolean = false;
  @ViewChild(Tooltip) tooltip!: Tooltip;

  ngOnChanges(changes: SimpleChanges) {
  }

  toggleDeleteFileDialog() {
    this.deleteFileDialog = !this.deleteFileDialog
  }

  copyLink(link: string): void {
    this.tooltip.activate()
    navigator.clipboard.writeText(link)
      .then(() => {
      })
      .catch((error) => {
      });
  }

  protected readonly format = format;
  protected readonly parseISO = parseISO;
  protected readonly getFileSize = getFileSize;
  protected readonly formatUploadDate = formatUploadDate;
}
