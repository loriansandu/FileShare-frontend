import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.css']
})
export class ProgressCircleComponent implements OnInit, OnChanges{
  @Input() progress!: number;
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    let scrollProgress = document.getElementById('progress');
    scrollProgress!.style.background = `conic-gradient(rgb(82, 104, 255) ${this.progress}%, #E8EBED ${this.progress}%)`;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }
}
