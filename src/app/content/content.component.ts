import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  message: String = ''

  longUrl: String = ''
  shortUrl: String = ''
  urls: any;
  urlGerada: string = ''

  loading: boolean = false

  constructor(
    private firestore: AngularFirestore,
  ) {
  }

  checkChar(): boolean {
    return true
  }

  regexShort(str: string) {
    return /^[A-Za-z0-9]*$/.test(str);
  }

  focoProx() {
    document.getElementById('shortUrl')?.focus();
  }

  canShort(): boolean {
    return this.longUrl.length<5 || this.shortUrl.length<2 || !this.regexShort(String(this.shortUrl));
  }

  encurtaURL() {
    if(this.loading==false) {
      let i = 0  
      this.message = ''
      this.urlGerada = ''
      const isUrl = require("is-valid-http-url");
  
      if(this.longUrl.length==0 && this.shortUrl.length==0) {
        this.message = 'Preencha o formulário'
      }
  
      else if(this.longUrl.length>0 && this.shortUrl.length==0) {
        this.message = 'Defina um Apelido para a URL'
      }
  
      else if(this.longUrl.length==0 && this.shortUrl.length>0) {
        this.message = 'Insira a URL longa'
      }
  
      else if(this.longUrl.length>0 && this.shortUrl.length>0 && this.canShort()==true) {
        this.message = 'Preencha o mínimo de caracteres sem espaços e caracteres especiais'
      }
  
      else if(this.longUrl.length>0 && this.shortUrl.length>0 && this.canShort()==false) {
        this.loading=true
        if (isUrl(this.longUrl)){
          console.log('URL Válida')
  
          this.firestore.collection('urls', ref=>ref.where('shortUrl','==',this.shortUrl)).valueChanges()
          .subscribe(result => {
          if(i==0){
            i+=1
          console.log('Resultados:',result.length);
          if (result.length>0) {
            this.message = 'Esse apelido ja existe!'
            this.loading = false
            return
          }
  
          else {

            const data = {
              longUrl: this.longUrl.trim(),
              shortUrl: this.shortUrl.trim().replaceAll(/\s/g,'')
            }
            this.firestore.collection('urls').add(data).then(() => {
              console.log('Link '+this.shortUrl+' adicionado!')
              this.urlGerada = window.location.href+this.shortUrl.trim().replaceAll(/\s/g,'')
              this.longUrl = ''
              this.shortUrl = ''
              this.loading = false
              return
            })
          }
        }
          })
    
      } else {
          this.message = 'Insira uma URL valida'
          console.log('URL Inválida')
          this.loading = false
      } 
      }
    }

    else {
      console.log('Carregando...')
    }

  }

  copyUrl() {
    if(this.urlGerada!='') {
      navigator.clipboard.writeText(this.urlGerada)
      this.message = 'Link Copiado'
    }
  }

}
