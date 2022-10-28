import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { OfferService } from '../_services/offer.service';

@Component({
  selector: 'app-add-offer-page',
  templateUrl: './add-offer-page.component.html',
  styleUrls: ['./add-offer-page.component.scss']
})
export class AddOfferPageComponent implements OnInit {
  //../../assets/category-logos/logo1.svg
  categories_array: {key: number, name: string, image: string}[] = [
    { key: 1, name:"Afval", image:"../../assets/category-logos/afval.svg"},
    { key: 2, name:"Inspiratie", image:"../../assets/category-logos/inspiratie.svg"},
    { key: 3, name:"Persoon", image:"../../assets/category-logos/mens.svg"},
    { key: 4, name:"Organisatie", image:"../../assets/category-logos/organisatie.svg"},
    { key: 4, name:"Technologie", image:"../../assets/category-logos/technologie.svg"},
  ];

  fileArr = [];
  imgArr = [];
  fileObj = [];
  form!: FormGroup;
  msg!: string;
  progress: number = 0;

  constructor(private fb: FormBuilder,  private sanitizer: DomSanitizer, private offerservice: OfferService) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      material: ['', []],
      submaterial: ['', []],
      tag: ['', []],
      new_tag: ['', []],
      street_number: ['', []],
      city: ['', []],
      country: ['', []],
      contact: ['', []],
      url: ['', []],
      terms: [Boolean, [Validators.required]],
      images: [null]
    })
   }

  ngOnInit(): void {
  }
  fileupload(e:any) {
    //place files in array to display on screen
    const fileListAsArray = Array.from(e);
    this.fileObj = [];

    fileListAsArray.forEach((image, i)=>{
      const file = (e as HTMLInputElement);
      const url = URL.createObjectURL(file[i]);
      this.imgArr.push(url);
      this.fileArr.push({ image , url: url });
    });

    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item)
    });

    // Set files form control
    this.form.patchValue({
      images: e
    })
    this.form.get('images').updateValueAndValidity();

  }
  onSubmit(){
    console.log("click");
    console.log(this.form.value);
    this.offerservice.addOffer(this.form.value).subscribe(res => console.log(res))
  }

  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
