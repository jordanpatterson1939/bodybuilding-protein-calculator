package main 

import (
	"fmt"
	"log"
	"net/http"
	"./handlers"
	"github.com/gorilla/mux"
)

func main(){
	r := mux.NewRouter()
	r.HandleFunc("/",handlers.AppHandler)
	r.HandleFunc("/daily-protein-requirement",handlers.ProteinRequirementHandler).Methods("POST")
	r.HandleFunc("/food-list",handlers.FoodHandler)
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/",http.FileServer(http.Dir("static"))))
	fmt.Println("Go to http://localhost:6060")
	err := http.ListenAndServe("localhost:6060",r)
	if err!=nil{
		log.Fatal(err)
	}
}