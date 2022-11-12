import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GeosearchService } from '../_services/geosearch.service';
import { OfferService } from '../_services/offer.service';
import { TagserviceService } from '../_services/tagservice.service';
import { cutomValidators } from './customvalidators';

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

  form!: FormGroup;

  categories_array: {key: number, name: string, image: string}[] = [
    { key: 1, name:"Afval", image:"../../assets/category-logos/afval.svg"},
    { key: 2, name:"Inspiratie", image:"../../assets/category-logos/inspiratie.svg"},
    { key: 3, name:"Persoon", image:"../../assets/category-logos/mens.svg"},
    { key: 4, name:"Organisatie", image:"../../assets/category-logos/organisatie.svg"},
    { key: 5, name:"Technologie", image:"../../assets/category-logos/technologie.svg"},
  ];

  iArr = [];
  fileArr = [];
  imgArr = [];
  fileObj = [];
  image_error_show = false;
  image_error = '';
  startfileArr = [];

  selectedCategory: {key: number, name: string, image: string} = {key: 0, name: 'Geen categorie geselecteerd', image: ''};

  materials: {id: number, name: string}[] = [];
  submaterials: {id: number, name: string}[] = [];
  selected_materials: {materialkey: number, materialname: string, submaterialkey: number, submaterialname: string}[] =[];

  tags: {id: number, name: string}[] = [];
  tagtimeout = null;
  selected_tags_count: number = 1;
  selected_tags: {key: number, tagname: string, new: boolean}[] = [];

  offer_validation_messages = {
    'category_id': [
      { type: 'required', message: 'Category is required' }
    ],
    'title': [
      { type: 'required', message: 'Title is required' },
      { type: 'minlength', message: 'Title must be at least 5 characters long' },
      { type: 'maxlength', message: 'Title cannot be more than 60 characters long' },
    ],
    'description': [
      { type: 'required', message: 'Description is required' },
      { type: 'minlength', message: 'Description must be at least 5 characters long' },
      { type: 'maxlength', message: 'Description cannot be more than 2000 characters long' },
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
      { type: 'maxlength', message: 'Street and number cannot be more than 100 characters long' },
    ],
    'city': [
      { type: 'maxlength', message: 'City cannot be more than 100 characters long' },
    ],
    'country': [
      { type: 'maxlength', message: 'Country cannot be more than 100 characters long' },
    ],
    'url': [
      { type: 'maxlength', message: 'Url cannot be more than 100 characters long' },
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
    ]
  }

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private offerservice: OfferService,
    private tagservice: TagserviceService,
    private geoservice: GeosearchService,
    private route: ActivatedRoute,
    private router: Router
    ) {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      material: [0, []],
      submaterial: [0, []],
      selectedmaterials:[[]],
      selectedsubmaterials:[[]],
      tag: ['', []],
      new_tag_input: ['', [Validators.maxLength(30)]],
      new_tags: [[], [Validators.compose([cutomValidators.betweenLength(0,20)])]],
      selectedtags:[[], [Validators.compose([cutomValidators.betweenLength(0,20)])]],
      street_number: ['', [Validators.maxLength(100)]],
      city: ['', [Validators.maxLength(100)]],
      country: ['', [Validators.maxLength(100)]],
      contact: ['', [Validators.maxLength(250)]],
      lat: [0, []],
      lon: [0, []],
      url: ['', [Validators.maxLength(100)]],
      terms: [false, [Validators.requiredTrue]],
      images: [null],
      editimages: [],
      category_id:['',Validators.required]
    })
   }

  ngOnInit(): void {
    const paramsub = this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      if(id){
        this.offerservice.getOfferById(id).then((res: any)=> {
          console.log(res);
          if(res.data.length > 0){
            //algemene info
            this.offerId = res.data[0].id;
            this.form.controls['title'].setValue(res.data[0].title);
            this.form.controls['description'].setValue(res.data[0].description);
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
                      this.selected_materials.push({materialkey: mat.id, materialname: mat.name, submaterialkey: submat.id, submaterialname: submat.name })
                      materialselected.push(parseInt(mat.id));
                      submaterialselected.push(parseInt(submat.id));
                      materialArray.push(mat.id);
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
                    this.selected_materials.push({materialkey: mat.id, materialname: mat.name, submaterialkey: 0, submaterialname: "" })
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
                this.startfileArr.push(img);
              });
            }

            this.form.patchValue({
              editimages: this.startfileArr,
            });
            this.form.get('editimages').updateValueAndValidity();

          }
        });
      }
    });
    this.offerservice.getMaterials().then(res => {this.materials = res['data']});
  }

  onSubmit(){
    if(this.form.status === 'VALID'){
      if(this.form.get('terms').value == true){
        console.log(this.form.value);
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
          this.offerservice.editOffer(this.form.value, this.offerId).subscribe(res => {
            console.log(res);
            this.router.navigate(['account', 'items']);
          });
        });
      }
      else{
        //show message terms

      }
    }
    else{
      //show message invalid
      this.form.markAllAsTouched();
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
  deleteImageFromStartArry(i: number){
    this.startfileArr.splice(i,1);
    this.form.patchValue({
      editimages: this.startfileArr,
    });
    console.log( this.startfileArr);
    this.form.get('editimages').updateValueAndValidity();
  }

 //  --------------------------------------- category  --------------------------------------- //
  categoryClicked(category_key: number){
    const found = this.categories_array.find(element => element.key === category_key);
    this.selectedCategory = found;
    this.setCategoryActive(category_key);
    this.form.patchValue({
      category_id: this.selectedCategory.key
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
    materialselected.push(parseInt(material));
    submaterialselected.push(parseInt(submaterial));

    this.form.patchValue({
      selectedmaterials: materialselected,
      selectedsubmaterials: submaterialselected
    })

    //maak pill met namen
    const foundmaterial = this.materials.find(element => element.id === parseInt(material));
    const foundsubmaterial = this.submaterials.find(element => element.id === parseInt(submaterial));
    this.selected_materials.push({materialkey: foundmaterial.id, materialname: foundmaterial.name, submaterialkey: foundsubmaterial.id, submaterialname: foundsubmaterial.name })
  }
  deleteFromSelectedMaterials(matkey: number, subkey: number){
    const found = this.selected_materials.find(element => element.materialkey === matkey && element.submaterialkey === subkey);

    //delete from form array
    const materialselected = this.form.get('selectedmaterials').value;
    const submaterialselected  = this.form.get('selectedsubmaterials').value;

    materialselected.splice(materialselected.indexOf(found.materialkey, 0), 1);
    submaterialselected.splice(submaterialselected.indexOf(found.submaterialkey,0), 1);

    this.form.patchValue({
      selectedmaterials: materialselected,
      selectedsubmaterials: submaterialselected
    })

   //delete visible pil
    this.selected_materials.splice(this.selected_materials.indexOf(found), 1);
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
      }, 1000);
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
}
