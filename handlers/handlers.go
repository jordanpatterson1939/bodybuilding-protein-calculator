package handlers 

import (
	"os"
	"fmt"
	"log"
	"io/ioutil"
	"strconv"
	"net/http"
	"html/template"
	"encoding/json"
)
type Page struct{
	Title string
	Route string
}
type FoodList struct{
	Foodlist []Food `json:"foods"`
}
type Food struct{
	Name string  `json:"name"`
	ServingSize string `json:"serving_size"`
	ProteinPerServing float64 `json:"protein_per_serving"`
}

func Check(err error){
	if err!=nil{
		log.Fatal(err)
	}
}
func renderTemplate(w http.ResponseWriter,p interface{}){
	temp := template.New("").Delims("((","))")
	temp,err := temp.ParseFiles("templates/app.html")
	Check(err)
	err=temp.ExecuteTemplate(w,"app",p)
}
func AppHandler(w http.ResponseWriter,r *http.Request){
	p := &Page{Title:"Bodybuilding Calculator",Route:"/app",}
	renderTemplate(w,p)
}
func ProteinRequirementHandler(w http.ResponseWriter,r *http.Request){
	var kgs float64
	r.ParseForm()
	weight := r.Form["weight"][0]
	unit := r.Form["unit"][0]
	
	weightToFloat,_ := strconv.ParseFloat(weight,64)
	if unit=="lbs"{
		kgs = GetKilogramsFromPounds(weightToFloat)
	}else{
		kgs = weightToFloat
	}
	proteinRequired := ProteinRequirementsFromKilograms(kgs)
	w.Write([]byte(proteinRequired))
}
func FoodHandler(w http.ResponseWriter,r *http.Request){
	jsonFile, err:= os.Open("./handlers/food.json")
	Check(err)
	bytes,_ := ioutil.ReadAll(jsonFile)
	w.Write(bytes)
}
func ProteinTrackerHandler(w http.ResponseWriter,r *http.Request){
	r.ParseForm()
	food := r.Form["food"][0]
	amount:= r.Form["amount"][0]
	// fmt.Println("Food: " +food+"\nAmount: "+amount)
	amountToFloat,_ := strconv.ParseFloat(amount,64)
	bytes, err := ioutil.ReadFile("./handlers/food.json")
	Check(err)
	data := FoodList{}
	json.Unmarshal([]byte(bytes),&data)
	// fmt.Println("Data:\n",data)
	for i:=0; i<len(data.Foodlist);i++{
		if data.Foodlist[i].Name==food{
			proteinRequired := amountToFloat*data.Foodlist[i].ProteinPerServing
			// fmt.Println(data.Foodlist[i])
			w.Write([]byte(fmt.Sprintf("%.2f",proteinRequired)))
		}
	}
}
func GetKilogramsFromPounds(pounds float64)float64 {
	return 0.453592 * pounds
}
func ProteinRequirementsFromKilograms(kilograms float64)string{
	proteinPerKg := 1.45
	requirements := proteinPerKg *kilograms
	return fmt.Sprintf("%.2f", requirements)
}