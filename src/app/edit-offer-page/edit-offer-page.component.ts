import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GeosearchService } from '../_services/geosearch.service';
import { OfferService } from '../_services/offer.service';
import { TagserviceService } from '../_services/tagservice.service';
import { cutomValidators } from './customvalidators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { selectedLang } from '../store/languagestate/lang.selector';
import { Category } from '../store/categorystate/category.model';
import { selectCategories } from '../store/categorystate/category.selector';
import { HotToastService } from '@ngneat/hot-toast';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';

@Component({
  selector: 'app-edit-offer-page',
  templateUrl: './edit-offer-page.component.html',
  styleUrls: ['./edit-offer-page.component.scss']
})
export class EditOfferPageComponent implements OnInit {
  @ViewChild('categories', { read: ElementRef }) categories!: ElementRef<HTMLInputElement>;
  @ViewChild('taglist', { read: ElementRef }) taglist!: ElementRef<HTMLInputElement>;

  environment_url = environment.apiUrl;
  offerId: number;
  offer:any;
  form!: FormGroup;
  langForm!: FormGroup;
  isSubmitting = false;

  // categories_array: {key: number, name: string, image: string}[] = [
  //   { key: 1, name:"Afval", image:"../../assets/category-logos/afval.svg"},
  //   { key: 2, name:"Inspiratie", image:"../../assets/category-logos/inspiratie.svg"},
  //   { key: 3, name:"Persoon", image:"../../assets/category-logos/mens.svg"},
  //   { key: 4, name:"Organisatie", image:"../../assets/category-logos/organisatie.svg"},
  //   { key: 5, name:"Technologie", image:"../../assets/category-logos/technologie.svg"},
  // ];
  categories_array: Category[];
  categories_array$ = this.store.select(selectCategories);

  iArr = [];
  fileArr = [];
  imgArr = [];
  fileObj = [];
  image_error_show = false;
  image_error = '';
  startfileArr = [];
  positionCount = 0;
  selectedCategory: Category = {
    id: 1,
    name: "",
    name_nl: "",
    name_en: "",
    name_fr: "",
    description: "",
    description_nl: "",
    description_en: "",
    description_fr: "",
    category_image: "",
  };

  materials: {id: number, name: string}[] = [];
  submaterials: {id: number, name: string}[] = [];
  selected_materials_count: number = 1;
  selected_materials: {key: number, materialkey: number, materialname: string, submaterialkey: number, submaterialname: string}[] =[];

  tags: {id: number, name: string}[] = [];
  tagtimeout = null;
  selected_tags_count: number = 1;
  selected_tags: {key: number, tagname: string, new: boolean}[] = [];

  lang$ = this.store.select(selectedLang);
  lang: string;

  addNL = false;
  addEN = false;
  addFR = false;

  offer_validation_messages = {
    'category_id': [
      { type: 'required', message: 'Category is required' }
    ],
    'title': [
      { type: 'required', message: 'Title is required' },
      { type: 'minlength', message: 'Title must be at least 1 characters long' },
      { type: 'maxlength', message: 'Title cannot be more than 150 characters long' },
    ],
    'description': [
      { type: 'required', message: 'Description is required' },
      { type: 'minlength', message: 'Description must be at least 1 characters long' },
      { type: 'maxlength', message: 'Description is to long' },
    ],
    'materials': [
      { type: 'betweenLength', message: 'There can only be 20 materials' },
    ],
    'submaterials': [
      { type: 'betweenLength', message: 'There can only be 20 submaterials' },
    ],
    'tags': [
      { type: 'betweenLength', message: 'There can only be 20 tags' },
    ],
    'new_tags': [
      { type: 'betweenLength', message: 'There can only be 20 new tags' },
    ],
    'street_number': [
      { type: 'maxlength', message: 'Street and number cannot be more than 250 characters long' },
    ],
    'city': [
      { type: 'maxlength', message: 'City cannot be more than 250 characters long' },
    ],
    'country': [
      { type: 'maxlength', message: 'Country cannot be more than 250 characters long' },
    ],
    'url': [
      { type: 'maxlength', message: 'Url cannot be more than 250 characters long' },
    ],
    'contact': [
      { type: 'maxlength', message: 'Contact cannot be more than 250 characters long' },
    ],
    'terms': [
      { type: 'required', message: 'You must accept terms and conditions' }
    ],
    'images': [
      { type: 'size', message: 'The max size in 2MB' },
      { type: 'extention', message: 'You must accept terms and conditions' }
    ],
    'title_nl': [
      { type: 'minlength', message: 'Title must be at least 1 characters long' },
      { type: 'maxlength', message: 'Title cannot be more than 150 characters long' },
    ],
    'description_nl': [
      { type: 'minlength', message: 'Description must be at least 1 characters long' },
      { type: 'maxlength', message: 'Description is to long' },
    ],
    'title_en': [
      { type: 'minlength', message: 'Title must be at least 1 characters long' },
      { type: 'maxlength', message: 'Title cannot be more than 150 characters long' },
    ],
    'description_en': [
      { type: 'minlength', message: 'Description must be at least 1 characters long' },
      { type: 'maxlength', message: 'Description is to long' },
    ],
    'title_fr': [
      { type: 'minlength', message: 'Title must be at least 1 characters long' },
      { type: 'maxlength', message: 'Title cannot be more than 150 characters long' },
    ],
    'description_fr': [
      { type: 'minlength', message: 'Description must be at least 1 characters long' },
      { type: 'maxlength', message: 'Description is to long' },
    ]
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private offerservice: OfferService,
    private tagservice: TagserviceService,
    private geoservice: GeosearchService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private store: Store,
    private toastService: HotToastService
    ) {

    this.lang$.subscribe(res => {
      this.lang =  res
      if(this.lang == 'nl'){
        this.addNL = false;
        if(this.offer.title_en || this.offer.description_en){
          this.addEN = true;
          this.langForm.controls['title_en'].setValue(this.offer.title_en);
          this.langForm.controls['description_en'].setValue(this.offer.description_en);
        }
        if(this.offer.title_fr || this.offer.description_fr){
          this.addFR = true;
          this.langForm.controls['title_fr'].setValue(this.offer.title_fr);
          this.langForm.controls['description_fr'].setValue(this.offer.description_fr);
        }
      }
      if(this.lang == 'en'){
        this.addEN = false;
        if(this.offer.title_nl || this.offer.description_nl){
          this.addNL = true;
          this.langForm.controls['title_nl'].setValue(this.offer.title_nl);
          this.langForm.controls['description_nl'].setValue(this.offer.description_nl);
        }
        if(this.offer.title_fr || this.offer.description_fr){
          this.addFR = true;
          this.langForm.controls['title_fr'].setValue(this.offer.title_fr);
          this.langForm.controls['description_fr'].setValue(this.offer.description_fr);
        }
      }
      if(this.lang == 'fr'){
        this.addFR = false;
        if(this.offer.title_en || this.offer.description_en){
          this.addEN = true;
          this.langForm.controls['title_en'].setValue(this.offer.title_en);
          this.langForm.controls['description_en'].setValue(this.offer.description_en);
        }
        if(this.offer.title_nl || this.offer.description_nl){
          this.addNL = true;
          this.langForm.controls['title_nl'].setValue(this.offer.title_nl);
          this.langForm.controls['description_nl'].setValue(this.offer.description_nl);
        }
      }
    });

    this.categories_array$.subscribe(res => {
      this.categories_array =  res
    });

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10000)]],
      material: [0, []],
      submaterial: [0, []],
      selectedmaterials:[[]],
      selectedsubmaterials:[[]],
      tag: ['', []],
      new_tag_input: ['', []],
      new_tags: [[], [Validators.compose([cutomValidators.betweenLength(0,20)])]],
      selectedtags:[[], [Validators.compose([cutomValidators.betweenLength(0,20)])]],
      street_number: ['', [Validators.maxLength(250)]],
      city: ['', [Validators.maxLength(250)]],
      country: ['', [Validators.maxLength(250)]],
      contact: ['', [Validators.maxLength(250)]],
      lat: [0, []],
      lon: [0, []],
      url: ['', [Validators.maxLength(250)]],
      terms: [false],
      newimages: [],
      editimages: [],
      category_id:['',Validators.required]
    });

    this.langForm = this.fb.group({
      title_nl: ['', [Validators.minLength(1), Validators.maxLength(150)]],
      description_nl: ['', [Validators.minLength(1), Validators.maxLength(10000)]],
      title_en: ['', [Validators.minLength(1), Validators.maxLength(150)]],
      description_en: ['', [Validators.minLength(1), Validators.maxLength(10000)]],
      title_fr: ['', [Validators.minLength(1), Validators.maxLength(150)]],
      description_fr: ['', [Validators.minLength(1), Validators.maxLength(10000)]],
    });

    this.translate.get('MESSAGES').subscribe((res)=>{
      this.offer_validation_messages = {
        'category_id': [
          { type: 'required', message: res.CATEGORY1 }
        ],
        'title': [
          { type: 'required', message: res.TITLE1 },
          { type: 'minlength', message: res.TITLE2 },
          { type: 'maxlength', message: res.TITLE3 },
        ],
        'description': [
          { type: 'required', message: res.DESCRIPTION2 },
          { type: 'minlength', message: res.DESCRIPTION2 },
          { type: 'maxlength', message: res.DESCRIPTION3},
        ],
        'materials': [
          { type: 'betweenLength', message: res.MATERIALS},
        ],
        'submaterials': [
          { type: 'betweenLength', message: res.SUBMATERIALS },
        ],
        'tags': [
          { type: 'betweenLength', message: res.TAGS},
        ],
        'new_tags': [
          { type: 'betweenLength', message: res.NEW_TAGS },
        ],
        'street_number': [
          { type: 'maxlength', message: res.STREET_NUMBER },
        ],
        'city': [
          { type: 'maxlength', message: res.CITY },
        ],
        'country': [
          { type: 'maxlength', message: res.COUNTRY },
        ],
        'url': [
          { type: 'maxlength', message: res.URL},
        ],
        'contact': [
          { type: 'maxlength', message: res.CONTACT },
        ],
        'terms': [
          { type: 'required', message: res.TERMS }
        ],
        'images': [
          { type: 'size', message: res.IMAGES2 },
          { type: 'extention', message: res.IMAGES2 }
        ],
        'title_nl': [
          { type: 'minlength', message: res.TITLE2 + " nl" },
          { type: 'maxlength', message: res.TITLE3 + " nl" },
        ],
        'description_nl': [
          { type: 'minlength', message: res.DESCRIPTION2 + " nl" },
          { type: 'maxlength', message: res.DESCRIPTION3 + " nl" },
        ],
        'title_en': [
          { type: 'minlength', message: res.TITLE2 + " en" },
          { type: 'maxlength', message: res.TITLE3 + " en"  },
        ],
        'description_en': [
          { type: 'minlength', message: res.DESCRIPTION2 + " en"  },
          { type: 'maxlength', message: res.DESCRIPTION3 + " en" },
        ],
        'title_fr': [
          { type: 'minlength', message: res.TITLE2 + " fr" },
          { type: 'maxlength', message: res.TITLE3 + " fr"  },
        ],
        'description_fr': [
          { type: 'minlength', message: res.DESCRIPTION2 + " fr"  },
          { type: 'maxlength', message: res.DESCRIPTION3 + " fr" },
        ]
      }
    })

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.offer_validation_messages = {
        'category_id': [
          { type: 'required', message: event.translations.MESSAGES.CATEGORY1 }
        ],
        'title': [
          { type: 'required', message: event.translations.MESSAGES.TITLE1 },
          { type: 'minlength', message: event.translations.MESSAGES.TITLE2 },
          { type: 'maxlength', message: event.translations.MESSAGES.TITLE3 },
        ],
        'description': [
          { type: 'required', message: event.translations.MESSAGES.DESCRIPTION2 },
          { type: 'minlength', message: event.translations.MESSAGES.DESCRIPTION2 },
          { type: 'maxlength', message: event.translations.MESSAGES.DESCRIPTION3},
        ],
        'materials': [
          { type: 'betweenLength', message: event.translations.MESSAGES.MATERIALS},
        ],
        'submaterials': [
          { type: 'betweenLength', message: event.translations.MESSAGES.SUBMATERIALS },
        ],
        'tags': [
          { type: 'betweenLength', message: event.translations.MESSAGES.TAGS},
        ],
        'new_tags': [
          { type: 'betweenLength', message: event.translations.MESSAGES.NEW_TAGS },
        ],
        'street_number': [
          { type: 'maxlength', message: event.translations.MESSAGES.STREET_NUMBER },
        ],
        'city': [
          { type: 'maxlength', message: event.translations.MESSAGES.CITY },
        ],
        'country': [
          { type: 'maxlength', message: event.translations.MESSAGES.COUNTRY },
        ],
        'url': [
          { type: 'maxlength', message: event.translations.MESSAGES.URL},
        ],
        'contact': [
          { type: 'maxlength', message: event.translations.MESSAGES.CONTACT },
        ],
        'terms': [
          { type: 'required', message: event.translations.MESSAGES.TERMS }
        ],
        'images': [
          { type: 'size', message: event.translations.MESSAGES.IMAGES2 },
          { type: 'extention', message: event.translations.MESSAGES.IMAGES2 }
        ],
        'title_nl': [
          { type: 'minlength', message: event.translations.MESSAGES.TITLE2 + " nl"  },
          { type: 'maxlength', message: event.translations.MESSAGES.TITLE3 + " nl"  },
        ],
        'description_nl': [
          { type: 'minlength', message: event.translations.MESSAGES.DESCRIPTION2 + "nl" },
          { type: 'maxlength', message: event.translations.MESSAGES.DESCRIPTION3 + "nl" },
        ],
        'title_en': [
          { type: 'minlength', message: event.translations.MESSAGES.TITLE2 + " en" },
          { type: 'maxlength', message: event.translations.MESSAGES.TITLE3 + " en" },
        ],
        'description_en': [
          { type: 'minlength', message: event.translations.MESSAGES.DESCRIPTION2 + " en" },
          { type: 'maxlength', message: event.translations.MESSAGES.DESCRIPTION3 + " en" },
        ],
        'title_fr': [
          { type: 'minlength', message: event.translations.MESSAGES.TITLE2 + " fr" },
          { type: 'maxlength', message: event.translations.MESSAGES.TITLE3 + " fr" },
        ],
        'description_fr': [
          { type: 'minlength', message: event.translations.MESSAGES.DESCRIPTION2 + " fr" },
          { type: 'maxlength', message: event.translations.MESSAGES.DESCRIPTION3 + " fr" },
        ]
      }
      this.offerservice.getMaterials(event.lang).then(res => {this.materials = res['data']});
    });
   }

  ngOnInit(): void {
    const paramsub = this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      if(id){
        this.offerservice.getEditOffer(id).then((res: any)=> {
          console.log(res);
          if(res.data.length > 0){
            //algemene info
            this.offer = res.data[0];
            this.offerId = res.data[0].id;
            this.form.controls['title'].setValue(res.data[0].title);
            this.form.controls['description'].setValue(res.data[0].description);

            if(this.lang == 'nl'){
              this.addNL = false;
              if(res.data[0].title_en || res.data[0].description_en){
                this.addEN = true;
                this.langForm.controls['title_en'].setValue(res.data[0].title_en);
                this.langForm.controls['description_en'].setValue(res.data[0].description_en);
              }
              if(res.data[0].title_fr || res.data[0].description_fr){
                this.addFR = true;
                this.langForm.controls['title_fr'].setValue(res.data[0].title_fr);
                this.langForm.controls['description_fr'].setValue(res.data[0].description_fr);
              }
            }
            if(this.lang == 'en'){
              this.addEN = false;
              if(res.data[0].title_nl || res.data[0].description_nl){
                this.addNL = true;
                this.langForm.controls['title_nl'].setValue(res.data[0].title_nl);
                this.langForm.controls['description_nl'].setValue(res.data[0].description_nl);
              }
              if(res.data[0].title_fr || res.data[0].description_fr){
                this.addFR = true;
                this.langForm.controls['title_fr'].setValue(res.data[0].title_fr);
                this.langForm.controls['description_fr'].setValue(res.data[0].description_fr);
              }
            }
            if(this.lang == 'fr'){
              this.addFR = false;
              if(res.data[0].title_en || res.date[0].description_en){
                this.addEN = true;
                this.langForm.controls['title_en'].setValue(res.data[0].title_en);
                this.langForm.controls['description_en'].setValue(res.data[0].description_en);
              }
              if(res.data[0].title_nl || res.data[0].description_nl){
                this.addNL = true;
                this.langForm.controls['title_nl'].setValue(res.data[0].title_nl);
                this.langForm.controls['description_nl'].setValue(res.data[0].description_nl);
              }
            }

            this.categoryClicked(res.data[0].category.id);

            if(res.data[0].location && res.data[0].location.street){
              this.form.controls['street_number'].setValue(res.data[0].location.street);
            }
            if(res.data[0].location && res.data[0].location.city){
              this.form.controls['city'].setValue(res.data[0].location.city);
            }
            if(res.data[0].location && res.data[0].location.country){
              this.form.controls['country'].setValue(res.data[0].location.country);
            }
            if(res.data[0].contact){
              this.form.controls['contact'].setValue(res.data[0].contact);
            }
            if(res.data[0].url){
              this.form.controls['url'].setValue(res.data[0].url);
            }
            if(res.data[0].tags){
              //tags
              const tags  = this.form.get('selectedtags').value;
              res.data[0].tags.forEach((element: any) => {
                tags.push(element.id);
                //maak pill met namen
                this.selected_tags.push({key: element.id, tagname: element.name, new: false});
                this.selected_tags_count ++;
              });
              this.form.patchValue({
                selectedtags: tags,
              });
            }
            if(res.data[0].materials){
              //materials
              const materialselected = this.form.get('selectedmaterials').value;
              const submaterialselected  = this.form.get('selectedsubmaterials').value;
              var materialArray = [];
              console.log(materialArray);
              //plaats alle materialen/submaterialen
              res.data[0].materials.forEach((mat: any) => {
                res.data[0].submaterials.forEach((submat: any) => {
                  if(mat.id === submat.material_id){
                    const found = this.selected_materials.find(element => element.materialkey === parseInt(mat.id) &&  element.submaterialkey === parseInt(submat.id));
                    if(!found){
                      this.selected_materials.push({key: this.selected_materials_count, materialkey: mat.id, materialname: mat.name, submaterialkey: submat.id, submaterialname: submat.name })
                      materialselected.push(parseInt(mat.id));
                      submaterialselected.push(parseInt(submat.id));
                      materialArray.push(mat.id);
                      this.selected_materials_count++;
                    }
                  }
                });
              });
              //plaats alle enkel materialen
              console.log(materialArray);
              res.data[0].materials.forEach((mat: any) => {
                  const findinArray = materialArray.find(element => element === (mat.id));
                  console.log(findinArray);
                  if(!findinArray){
                    materialselected.push(parseInt(mat.id));
                    this.selected_materials.push({key: this.selected_materials_count, materialkey: mat.id, materialname: mat.name, submaterialkey: 0, submaterialname: "" })
                    this.selected_materials_count++;
                  };
              });

              this.form.patchValue({
                selectedmaterials: materialselected,
                selectedsubmaterials: submaterialselected
              });
              console.log("materialselected",materialselected);
              console.log("submaterialselected",submaterialselected)
            }

            if(res.data[0].images){
              //images
              res.data[0].images.forEach((img: any) => {
                this.startfileArr.push({id:img.id, url:this.environment_url + img.filename, image:{name:img.filename}, position:img.position, new:false});
                this.positionCount++;
              });
            }
            this.form.patchValue({
              editimages: this.startfileArr,
            });
          }
        });
      }
    });
    this.offerservice.getMaterials(this.lang).then(res => {this.materials = res['data']});
  }

  onSubmit(){
    if(this.form.status === 'VALID' && this.langForm.status === 'VALID'){
      if(this.form.get('terms').value == true && this.isSubmitting == false){
        this.isSubmitting = true;
        console.log(this.form.value);
        //afbeeldingen de positie juist plaatsen
        var count = 1;
        this.startfileArr.forEach((element)=>{
          element.position = count;
          count++;
        })
        // Set files form control
        this.form.patchValue({
          editimages: this.startfileArr
        })

        //locatie
        const searchTerm = (this.form.value.street_number + '+' + this.form.value.city + '+' + this.form.value.country).toLowerCase();
        this.geoservice.searchWordPhoton(searchTerm)
        .subscribe((features: any) => {
          console.log(features);
          if(features.length > 0){
            this.form.patchValue({
              lat: features[0].lat,
              lon: features[0].lon
            })
          }
          this.offerservice.editOffer(this.form.value, this.offerId, this.langForm.value, this.lang).subscribe({
            next: data => {
              console.log(data);
              this.router.navigate(['account', 'items']);
              this.isSubmitting = false;
              },
            error: err_res => {
              this.isSubmitting = false;
              alert('Item kon niet worden aangepast');
            }

          });
        });
      }
      else{
        //show message terms
        this.toastService.error(this.offer_validation_messages.terms[0].message, {
          position: 'top-right',
          style: {
            border: '2px solid #EF4444',
            padding: '16px',
            color: '#EF4444',
            background: '#fff'
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        });
      }
    }
    else{
      //show message invalid
      this.form.markAllAsTouched();
      this.GetToastForFields();
    }
  }


  // --------------------------------------- afbeeldingen  --------------------------------------- //
  fileupload(e:any) {
    console.log(e);
    //place files in array to display on screen
    const fileListAsArray = Array.from(e);

    fileListAsArray.forEach((image:any, i) => {
      console.log(image.size);
      if(image.size > 2000000){
        this.image_error_show = true;
        this.image_error = 'size';
        return;
      }
      else{
        const file = (e as HTMLInputElement);
        const url = URL.createObjectURL(file[i]);
        this.startfileArr.push({url: url, image:image, position:this.positionCount, new:true});
        this.positionCount++;
        this.iArr.push(image);
      }
    });

    console.log(this.startfileArr);

    // Set files form control
    this.form.patchValue({
      newimages: this.iArr
    })

    this.form.get('newimages').updateValueAndValidity();

  }
  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  deleteImageFromArry(i: number){
    this.iArr.splice(i,1);
  }

  deleteImageFromStartArry(i: number){
    this.iArr.splice(this.iArr.indexOf(this.iArr.find(el => el.image == this.startfileArr[i].image)),1);
    this.startfileArr.splice(i,1);
    this.form.patchValue({
      newimages: this.iArr,
      editimages: this.startfileArr,
    });
  }

  drop(event: CdkDragDrop<[]>) {
    console.log(event);
    moveItemInArray(this.startfileArr, event.previousIndex, event.currentIndex);
  }

 //  --------------------------------------- category  --------------------------------------- //
  categoryClicked(category_key: number){
    const found = this.categories_array.find(element => element.id === category_key);
    this.selectedCategory = found;
    this.setCategoryActive(category_key);
    this.form.patchValue({
      category_id: this.selectedCategory.id
    })
  }
  setCategoryActive(category_number: number){
    for(var i = 0; i < this.categories.nativeElement.children.length; i++){
      this.categories.nativeElement.children[i].classList.remove('active');
    }
    this.categories.nativeElement.children[category_number-1].classList.add('active');
  }

  //  --------------------------------------- materials  --------------------------------------- //
  getSubMaterials(event: any){
    //console.log(event);
    this.offerservice.getSubMaterials(event.target.value).then(res => {console.log(res); this.submaterials = res['data']});
  }
  addToSelectedMaterials(){
    //verander formvalue
    const material = this.form.get('material').value;
    const submaterial = this.form.get('submaterial').value;

    const materialselected = this.form.get('selectedmaterials').value;
    const submaterialselected  = this.form.get('selectedsubmaterials').value;

    var foundmaterial = {id: 0, name: ""};
    var foundsubmaterial = {id: 0, name: ""};

    if(material){
      if(material != 0){
        console.log("add material");
         foundmaterial = this.materials.find(element => element.id === parseInt(material));
         materialselected.push(parseInt(material));
      }
      if(submaterial){
        console.log("add submaterial");
        foundsubmaterial = this.submaterials.find(element => element.id === parseInt(submaterial));
        console.log("foundsubmaterial",foundsubmaterial);
        if(foundsubmaterial !== undefined){
          submaterialselected.push(parseInt(submaterial));
        }else{
          foundsubmaterial = {id: 0, name: ""};
        }
      }
      this.form.patchValue({
        selectedmaterials: materialselected,
        selectedsubmaterials: submaterialselected
      });
    }

    //maak pill met namen
    this.selected_materials.push({key: this.selected_materials_count, materialkey: foundmaterial.id, materialname: foundmaterial.name, submaterialkey: foundsubmaterial.id, submaterialname: foundsubmaterial.name })
    this.selected_materials_count ++;
    console.log("materialselected",materialselected);
    console.log("submaterialselected",submaterialselected);
  }

  deleteFromSelectedMaterials(key: number){
    const found = this.selected_materials.find(element => element.key === key);
    console.log("delete found", found)

    //delete from form array
    const materialselected = this.form.get('selectedmaterials').value;
    const submaterialselected  = this.form.get('selectedsubmaterials').value;

    materialselected.splice(materialselected.indexOf(found.materialkey, 0), 1);
    if(found.submaterialkey != 0){
      submaterialselected.splice(submaterialselected.indexOf(found.submaterialkey,0), 1);
    }

    this.form.patchValue({
      selectedmaterials: materialselected,
      selectedsubmaterials: submaterialselected
    })

   //delete visible pil
    this.selected_materials.splice(this.selected_materials.indexOf(found), 1);
    this.selected_materials_count --;
    console.log("materialselected",materialselected);
    console.log("submaterialselected",submaterialselected)
  }

  //  --------------------------------------- tags  --------------------------------------- //
  autocompleteTag(event){
    clearTimeout(this.tagtimeout);
    // Make a new timeout set to go off in 1000ms (1 second)
    if(event.target.value === ""){
      this.taglist.nativeElement.style.display = "none";
    }else{
      this.taglist.nativeElement.style.display = "block";
      this.tagtimeout = setTimeout(() => {
        //console.log(event.target.value);
        this.tagservice.tagsTypeAhead(event.target.value).subscribe((res:any) => {this.tags = res.data});
      }, 50);
    }
  }
  //om dropdown te verbergen
  containerClicked(){
    this.taglist.nativeElement.style.display = "none";
  }
  taglistitemclicked(key: number, name:string){
    this.form.patchValue({
      tag: name
   })
  }

  addToSelectedTags(){
    //vraag de waarden van de taginput op
    const tag = this.form.get('tag').value;
    var tag_id: number;
    var isInDatabase = false;

    //kijk of er iets is ingevuld in het input veld
    if(this.onlySpaces(tag) !== true){
    //kijk of de tag niet is geselecteerd
      const found = this.selected_tags.find(element => element.tagname === tag);
      if(!found){
        //kijk of de tag niet bestaat.
        this.tagservice.tagsTypeAhead(tag).subscribe(
          (res:any) => {
            console.log(res);
            if(res){
              res.data.forEach((res_element: any) =>{
                const found_of_database = res_element;
                console.log(found_of_database.name);
                if(found_of_database.name == tag){
                  isInDatabase = true;
                  tag_id = found_of_database.id
                }
              });
              console.log(isInDatabase);
              //als het in de database zit
              if(isInDatabase == true){
                const found = this.selected_tags.find(element => element.tagname === tag);
                if(!found){
                  const tags  = this.form.get('selectedtags').value;
                  tags.push(tag_id);

                  this.form.patchValue({
                    selectedtags: tags,
                  })

                  //maak pill met namen
                  this.selected_tags.push({key: this.selected_tags_count, tagname: tag, new: false})
                  this.selected_tags_count ++;
                  console.log(this.selected_tags);
                }
              }
              //als het niet in de database zit
              else{
                const tags = this.form.get('new_tags').value;
                tags.push(tag);
                this.form.patchValue({
                  new_tags: tags,
                });
                this.selected_tags.push({key: this.selected_tags_count, tagname: tag, new:true})
                this.selected_tags_count ++;
                console.log(this.selected_tags);
              }
            }
            this.form.patchValue({
              tag: ""
            });
          }
        );
      }
    }

  }

  //hulpfunctie
  onlySpaces(str: string) {
    return str.trim().length === 0;
  }
  deleteFromSelectedTags(name: string, newed: boolean){
    const found = this.selected_tags.find(element => element.tagname === name);
    console.log(found);
    //delete from form array
    if(newed === true){
      const newtags = this.form.get('new_tags').value;
      console.log(newtags);
      const foundnew = newtags.find(element => element === found.tagname);
      console.log(foundnew);
      console.log(newtags.indexOf(foundnew, 0));
      newtags.splice(newtags.indexOf(foundnew, 0), 1);
      this.form.patchValue({
        new_tags: newtags
      });
    }
    else{
      const tags = this.form.get('selectedtags').value;
      console.log(tags);
      tags.splice(tags.indexOf(tags.find(element => element == found.key), 0), 1);
      console.log(tags);
      this.form.patchValue({
        selectedtags: tags,
      });
    }
    this.selected_tags_count --;
    //delete visible pil
    this.selected_tags.splice(this.selected_tags.indexOf(found), 1);
  }

  stepperButtonClicked(){
    this.form.markAllAsTouched();
    this.langForm.markAllAsTouched();
    if(this.form.invalid){
      this.GetToastForFields();
    }
  }

  GetToastForFields(){
    const validation_array = ['title','description','category_id','materials','submaterials','tags','new_tags','street_number','city','country','url','contact','terms', 'images'];
    validation_array.forEach(validation_item => {
      this.offer_validation_messages[validation_item].forEach((validation_message: any) => {
        if(this.form.get(validation_item) !== null){
          if(this.form.get(validation_item).hasError(validation_message.type)){
                  this.toastService.error(validation_message.message, {
                    position: 'top-right',
                    style: {
                      border: '2px solid #EF4444',
                      padding: '16px',
                      color: '#EF4444',
                      background: '#fff'
                    },
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  });
                }
        }


      });
    });

    const validation_array2 = ['title_nl','description_nl','title_fr','description_fr','title_en','description_en'];
    validation_array2.forEach(validation_item => {
      this.offer_validation_messages[validation_item].forEach((validation_message: any) => {
        if(this.langForm.get(validation_item).hasError(validation_message.type)){
          this.toastService.error(validation_message.message, {
            position: 'top-right',
            style: {
              border: '2px solid #EF4444',
              padding: '16px',
              color: '#EF4444',
              background: '#fff'
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          });
        }

      });
    });
  }
}
