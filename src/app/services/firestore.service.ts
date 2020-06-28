import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ClauseModel } from '../modelos/clause.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  db = firebase.firestore();

  constructor() { }


  fnAddCollection(collection: string, obj: any) {

    return new Promise((resolve) => {
      this.db
        .collection(collection)
        .add(obj)
        .then((docRef) => {
          resolve(true);
        })
        .catch((error) => {
          resolve(false);
        });
        this.db.clearPersistence();
    });
  }

  fnGetElements(collection:string){
    return new Promise((resolve) => {
      this.db
        .collection(collection).onSnapshot((data)=>{
          resolve(data)
        })
        this.db.clearPersistence();
    });
  }

  fnGetElementById(collection:string,searchField:string,id:any){
    return new Promise((resolve) => {
      console.log(collection)
      console.log(searchField)
      console.log(id)
      this.db.clearPersistence();
      this.db
        .collection(collection).where(searchField,'==',id).onSnapshot((data)=>{
          resolve(data)
        })
      
    });
  }

  fnFindByMultipleClauses(collection:string,clauses:ClauseModel[]){
    return new Promise((resolve)=>{
      let db:any = this.db.collection(collection);
      clauses.forEach(value=>{
        //db.orderBy(value.key).startAt(value.value).endAt(value.value+'\uf8ff')
        db = db.where(value.key,value.condition as any,value.value)
      });
      db.limit(1);
      db.onSnapshot((data)=>{
        resolve(data)
      })
      this.db.clearPersistence();
    })

  }

  fnUpdateDoc(collection:string,doc,newDocument:any){
    
    return new Promise((resolve)=>{
      let batch = firebase.firestore().batch()
      const docRef = firebase.firestore().collection(collection).doc(doc.id)
      batch.update(docRef, newDocument).commit()
      .then(res=>{
        resolve(true)
      })
      .catch(error=>{
        resolve(false)
      })
      this.db.clearPersistence();
    })
  }

  fnDeleteDoc(collection:string,doc){
    
    return new Promise((resolve)=>{
      let batch = firebase.firestore().batch()
      const docRef = firebase.firestore().collection(collection).doc(doc.id)
      batch.delete(docRef).commit()
      .then(res=>{
        resolve(true)
      })
      .catch(error=>{
        resolve(false)
      })
      this.db.clearPersistence();
    })
  }

}
