import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'apartment-portal';

  ngOnInit(): void {
    const cc = window as any;
    cc.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#228B22'
        },
        button: {
          background: '#32CD32',
          text: '#185b18'
        }
      },
      theme: 'classic',
      content: {
        message: 'We use cookies to understand how you use our site and to improve your experience.  ' +
          'To view our Privacy Policy, effective April 20, 2020, ',
        dismiss: 'Dismiss',
        link: 'click here.',
        href:  '/dataprivacy'
      }
    });
  }
}
