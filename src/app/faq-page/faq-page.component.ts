import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectedLang } from '../store/languagestate/lang.selector';
import { FaqService } from '../_services/faq.service';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FAQPageComponent implements OnInit {

  questions: any;

  lang$ = this.store.select(selectedLang);
  lang: string;

  constructor(private faqservice: FaqService, private store: Store) {
    this.lang$.subscribe(res => {
      this.lang =  res
    });
   }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.faqservice.get_faq().subscribe(
      (res: any) => {
        console.log(res)
        this.questions = res.data;
      }
    )
  }

}
