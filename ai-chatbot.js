const OPENROUTER_API_KEY = "YOUR_API_KEY";
function toggleAIChat(){
  let box=document.getElementById("aiChatBox");
  if(box.style.display==="flex"){
    box.style.display="none";
  }else{
    box.style.display="flex";
  }
}

async function sendAIMessage(){

  let input=document.getElementById("aiInput");
  let body=document.getElementById("aiChatBody");
  let text=input.value.trim();

  if(text==="") return;

  body.innerHTML += `<div class="ai-msg ai-user">${text}</div>`;
  input.value="";

  body.innerHTML += `
  <div class="ai-msg ai-bot" id="aiTyping">
    <div class="ai-typing">
      <span></span><span></span><span></span>
    </div>
  </div>`;

  body.scrollTop=body.scrollHeight;

  let reply = await askAI(text);

if(!reply || reply.trim() === ""){
  reply = "Sorry, AI reply empty aaya. Dobara try karo.";
}

  let typing=document.getElementById("aiTyping");
  if(typing){
   typing.innerHTML = `<div>${reply}</div>`;
    typing.removeAttribute("id");
  }

  body.scrollTop=body.scrollHeight;
}
function formatAIResponse(text){

  text = text.replace(/```([\s\S]*?)```/g, function(match, code){
    return `
      <pre class="ai-code">
${code}
      </pre>
    `;
  });

  return text.replace(/\n/g,"<br>");
}
async function askAI(question){

  let prompt = `
You are Smart Auth AI Assistant.

Rules:
- User jo bhi question puche, uska answer do.
- Coding, HTML, CSS, JavaScript, project, AI, study, general knowledge sab answer kar sakte ho.
- Answer simple Hinglish me do.
- Answer short, clear aur helpful rakho.
- Agar coding question ho toh step-by-step explain karo.
- Agar Smart Auth project ka question ho toh professionally explain karo.

User Question:
${question}
- If user asks:
  "Who made you?"
  "Who created you?"
  "Tumhe kisne banaya?"
  "Who is your owner?"

Then answer:
"Himanshu Kundra ne mujhe banaya hai."

User Question:
${question}
`;

  try{
    let res = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " + OPENROUTER_API_KEY
    },
    body:JSON.stringify({
      model:"deepseek/deepseek-chat:",
  messages:[
    {
      role:"user",
      content:prompt
    }
  ]
})
  }
);

    let data = await res.json();
    console.log(data);

    if(data.error){
  if(data.error.message.includes("quota") || data.error.message.includes("Quota")){
    return "Abhi AI quota khatam ho gaya hai. Demo ke liye: Smart Auth ek secure login system hai jisme ID Login, Face Login, OTP, Attendance aur Admin Dashboard features hain.";
  }

  return "AI Error: " + data.error.message;
}

    let aiText = data.choices?.[0]?.message?.content;

if(!aiText){
  return "Sorry, AI reply nahi de paya. Please dobara try karo.";
}
return formatAIResponse(aiText);

  }catch(error){
    return "Network Error: " + error.message;
  }
}
document.getElementById("aiInput").addEventListener("keypress", function(e){

  if(e.key === "Enter"){
    sendAIMessage();
  }

});