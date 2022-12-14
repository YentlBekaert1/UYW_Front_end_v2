import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GeosearchService } from '../_services/geosearch.service';
import { OfferService } from '../_services/offer.service';
import { TagserviceService } from '../_services/tagservice.service';
import { cutomValidators } from './customvalidators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Category } from '../store/categorystate/category.model';
import { Store } from '@ngrx/store';
import { selectCategories } from '../store/categorystate/category.selector';
import { selectedLang } from '../store/languagestate/lang.selector';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-offer-page',
  templateUrl: './add-offer-page.component.html',
  styleUrls: ['./add-offer-page.component.scss']
})
export class AddOfferPageComponent implements OnInit {

  @ViewChild('categories', { read: ElementRef }) categories!: ElementRef<HTMLInputElement>;
  @ViewChild('taglist', { read: ElementRef }) taglist!: ElementRef<HTMLInputElement>;

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

  selectedCategory: Category;

  materials: {id: number, name: string}[] = [];
  submaterials: {id: number, name: string}[] = [];
  selected_materials_count: number = 1;
  selected_materials: {key: number, materialkey: number, materialname: string, submaterialkey: number, submaterialname: string}[] =[];

  tags: {id: number, name: string}[] = [];
  tagtimeout = null;
  selected_tags_count: number = 1;
  selected_tags: {key: number, tagname: string, new: boolean}[] = [];
  taglistindex: number;

  lang$ = this.store.select(selectedLang);
  lang: string;

  addNL = false;
  addEN = false;
  addFR = false;

  user_items: any;
  linked_items_count: number = 0;
  linked_items: {id: number, title: string}[] =[];

  displayedColumnsUserItems: string[] = ['link', 'category', 'title'];

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
      minHeight: '5',
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
        {class: 'montserrat', name: 'Montserrat'},
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
      [
      ],
      [
        'customClasses',
        'insertImage',
        'insertVideo',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
};

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private offerservice: OfferService,
    private tagservice: TagserviceService,
    private geoservice: GeosearchService,
    private router: Router,
    private translate: TranslateService,
    private store: Store,
    private toastService: HotToastService
    ) {

    this.lang$.subscribe(res => {
      this.lang =  res
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
      new_tags: [[], [Validators.compose([cutomValidators.betweenLength(0,20)])]],
      selectedtags:[[], [Validators.compose([cutomValidators.betweenLength(0,20)])]],
      street_number: ['', [Validators.maxLength(250)]],
      city: ['', [Validators.maxLength(250)]],
      country: ['', [Validators.maxLength(250)]],
      contact: ['', [Validators.maxLength(250)]],
      lat: [0, []],
      lon: [0, []],
      url: ['', [Validators.maxLength(250)]],
      terms: [false, []],
      images: [null],
      category_id:['',Validators.required],
      linked_item:[0],
      selectedlinkeditems:[[]]
    });

    this.langForm = this.fb.group({
      title_nl: ['', [Validators.minLength(1), Validators.maxLength(150)]],
      description_nl: ['', [Validators.minLength(1), Validators.maxLength(10000)]],
      title_en: ['', [Validators.minLength(1), Validators.maxLength(150)]],
      description_en: ['', [Validators.minLength(1), Validators.maxLength(10000)]],
      title_fr: ['', [Validators.minLength(1), Validators.maxLength(150)]],
      description_fr: ['', [Validators.minLength(1), Validators.maxLength(10000)]],
    })

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
    this.offerservice.getMaterials(this.lang).then(res => {
      //console.log(res['data']);
      this.materials = res['data']
    });
    this.offerservice.getAllUserOffers().then(res => {
      console.log(res['data']);
      this.user_items = res['data']
    });
  }

  onSubmit(){
    if(this.form.status === 'VALID' && this.langForm.status === 'VALID'){
      if(this.form.get('terms').value == true && this.isSubmitting == false){
        this.isSubmitting = true;
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
          this.offerservice.addOffer(this.form.value, this.langForm.value, this.lang).subscribe({
            next: data => {
              console.log(data);
              this.router.navigate(['account', 'items']);
              this.isSubmitting = false;
              },
            error: err_res => {
              this.isSubmitting = false;
              alert('Item kon niet worden toegevoegd');
              window.scrollTo(0,0);
            }

          });
        });
      }else{
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
        this.imgArr.push(url);
        this.fileArr.push({ image , url: url });
        this.iArr.push(image);
      }
    });

    console.log(this.fileArr);

    // Set files form control
    this.form.patchValue({
      images: this.iArr
    })

    this.form.get('images').updateValueAndValidity();

  }
  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  deleteImageFromArry(i: number){
    console.log(i)
    this.fileArr.splice(i,1);
    this.iArr.splice(i,1);
  }

  drop(event: CdkDragDrop<[]>) {
    console.log(event);
    moveItemInArray(this.fileArr, event.previousIndex, event.currentIndex);
    moveItemInArray(this.iArr, event.previousIndex, event.currentIndex);

    this.form.patchValue({
      images: this.iArr
    })

    this.form.get('images').updateValueAndValidity();
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
    this.offerservice.getSubMaterials(event.target.value, this.lang).then(res => {console.log(res); this.submaterials = res['data']});
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
      //maak pill met namen
      this.selected_materials.push({key: this.selected_materials_count, materialkey: foundmaterial.id, materialname: foundmaterial.name, submaterialkey: foundsubmaterial.id, submaterialname: foundsubmaterial.name })
      this.selected_materials_count ++;
      console.log("materialselected",materialselected);
      console.log("submaterialselected",submaterialselected)
    }
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
    this.taglistindex = -1;
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
  //als er naast de dropdown geklikt word.
  containerClicked(){
    this.taglist.nativeElement.style.display = "none";
  }

  taglistitemclicked(key: number, name:string){
    this.form.patchValue({
       tag: name
    });
    this.addToSelectedTags();
  }
  onEnterTaglist($event){
    this.addToSelectedTags();
  }
  onUpTaglist($event){
    console.log(this.taglistindex)
    if(this.taglistindex > -2){
      this.taglistindex = this.taglistindex - 1;
    }
  }
  onDownTaglist($event){
    this.taglistindex = this.taglistindex + 1;
    console.log(this.taglistindex)
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

  deleteFromSelectedTags(key: number, newed: boolean){
    const found = this.selected_tags.find(element => element.key === key);
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
      tags.splice(tags.indexOf(found.key, 0), 1);
      this.form.patchValue({
        selectedtags: tags,
      });
    }

    //delete visible pil
    this.selected_tags.splice(this.selected_tags.indexOf(found), 1);
  }

    //  --------------------------------------- Linked items  --------------------------------------- //

    addToSelectedLinkeditems(id: number){
      //verander formvalue
      // const linked_item = this.form.get('linked_item').value;
      const linked_item = id;
      const linkeditemselected = this.form.get('selectedlinkeditems').value;

      const found = this.linked_items.find(element => element.id === linked_item);
      console.log(found);

      if(!found){
        var foundlinkeditem = {id: 0, title: ""};
        if(linked_item){
          if(linked_item != 0){
            console.log("add linked items");
            foundlinkeditem = this.user_items.find(element => element.id === linked_item);
            linkeditemselected.push(linked_item);
          }

          this.form.patchValue({
            selectedlinkeditems: linkeditemselected,
          });

          //maak pill met namen
          this.linked_items.push({id: foundlinkeditem.id, title: foundlinkeditem.title})
          this.linked_items_count ++;
          console.log("linkeditemselected",this.linked_items);
        }
      }
      else{
        //delete from form array
        const linkeditemselected = this.form.get('selectedmaterials').value;

        linkeditemselected.splice(linkeditemselected.indexOf(found.title, 0), 1);

        this.form.patchValue({
          selectedlinkeditems: linkeditemselected,
        })

        //delete visible pil
        this.linked_items.splice(this.linked_items.indexOf(found), 1);
        this.linked_items_count --;
        console.log("linkeditemselected",this.linked_items);
      }

    }

  //  --------------------------------------- other functions  --------------------------------------- //

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
