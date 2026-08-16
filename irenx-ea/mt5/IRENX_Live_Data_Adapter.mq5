//+------------------------------------------------------------------+
//| IRENX PRIME - MT5 Live Data Adapter                             |
//| Sends multi-timeframe market snapshots to IRENX Intelligence.   |
//| Analysis-only: this EA does not place trades.                  |
//+------------------------------------------------------------------+
#property strict
#property version   "1.1"
#property description "IRENX PRIME MT5 Live Data Adapter - analysis only"

input string InpEndpoint      = "https://YOUR-VERCEL-DOMAIN.vercel.app/api/intelligence";
input string InpApiKey        = "CHANGE_ME";
input string InpSymbol        = "";
input int    InpBarsPerTF     = 40;
input int    InpIntervalSec   = 15;
input bool   InpSendOnNewBar  = true;
input bool   InpShowPanel     = true;

string g_symbol;
datetime g_last_sent = 0;
datetime g_last_bar_m5 = 0;

string JsonEscape(string s)
{
   StringReplace(s,"\\","\\\\");
   StringReplace(s,"\"","\\\"");
   StringReplace(s,"\r","\\r");
   StringReplace(s,"\n","\\n");
   return s;
}

string Num(double v,int digits=6) { return DoubleToString(v,digits); }

string BarArray(ENUM_TIMEFRAMES tf,int count)
{
   MqlRates r[];
   ArraySetAsSeries(r,true);
   int n=CopyRates(g_symbol,tf,0,count,r);
   if(n<=0) return "[]";

   string out="[";
   for(int i=n-1;i>=0;i--)
   {
      if(i<n-1) out+=",";
      out+="{\"time\":"+(string)r[i].time+
           ",\"open\":"+Num(r[i].open)+
           ",\"high\":"+Num(r[i].high)+
           ",\"low\":"+Num(r[i].low)+
           ",\"close\":"+Num(r[i].close)+
           ",\"tick_volume\":"+(string)r[i].tick_volume+
           ",\"spread_points\":"+(string)r[i].spread+"}";
   }
   return out+"]";
}

string JsonField(string json,string key)
{
   string token="\""+key+"\"";
   int p=StringFind(json,token);
   if(p<0) return "-";
   p=StringFind(json,":",p+StringLen(token));
   if(p<0) return "-";
   p++;
   while(p<StringLen(json) && (StringGetCharacter(json,p)==' ' || StringGetCharacter(json,p)=='\t')) p++;
   if(p<StringLen(json) && StringGetCharacter(json,p)=='\"')
   {
      p++;
      int e=StringFind(json,"\"",p);
      if(e<0) return "-";
      return StringSubstr(json,p,e-p);
   }
   int e1=StringFind(json,",",p);
   int e2=StringFind(json,"}",p);
   int e=e1;
   if(e<0 || (e2>=0 && e2<e)) e=e2;
   if(e<0) e=StringLen(json);
   string v=StringSubstr(json,p,e-p);
   StringTrimLeft(v); StringTrimRight(v);
   return v;
}

void ShowSignal(string body,int http_code)
{
   string status=JsonField(body,"status");
   string bias=JsonField(body,"bias");
   string confidence=JsonField(body,"confidence");
   string entry=JsonField(body,"entry");
   string sl=JsonField(body,"sl");
   string tp1=JsonField(body,"tp1");
   string tp2=JsonField(body,"tp2");
   string tp3=JsonField(body,"tp3");
   string trigger=JsonField(body,"trigger");
   string invalidation=JsonField(body,"invalidation");
   string next_action=JsonField(body,"next_action");
   string regime=JsonField(body,"regime");

   string panel="IRENX PRIME LIVE\n";
   panel+="------------------------------\n";
   panel+="SYMBOL   : "+g_symbol+"\n";
   panel+="STATUS   : "+status+"\n";
   panel+="BIAS     : "+bias+"\n";
   panel+="CONF     : "+confidence+"\n";
   panel+="ENTRY    : "+entry+"\n";
   panel+="SL       : "+sl+"\n";
   panel+="TP1      : "+tp1+"\n";
   panel+="TP2      : "+tp2+"\n";
   panel+="TP3      : "+tp3+"\n";
   panel+="REGIME   : "+regime+"\n";
   panel+="TRIGGER  : "+trigger+"\n";
   panel+="INVALID  : "+invalidation+"\n";
   panel+="ACTION   : "+next_action+"\n";
   panel+="HTTP     : "+(string)http_code;
   Comment(panel);
}

string BuildPayload()
{
   MqlTick tick;
   if(!SymbolInfoTick(g_symbol,tick)) return "";

   double point=SymbolInfoDouble(g_symbol,SYMBOL_POINT);
   double spread=(point>0.0 ? (tick.ask-tick.bid)/point : 0.0);
   long digits=SymbolInfoInteger(g_symbol,SYMBOL_DIGITS);

   string p="{";
   p+="\"symbol\":\""+JsonEscape(g_symbol)+"\",";
   p+="\"source\":\"MT5\",";
   p+="\"adapter_version\":\"1.1\",";
   p+="\"timestamp\":"+(string)TimeCurrent()+",";
   p+="\"market\":{";
   p+="\"bid\":"+Num(tick.bid,(int)digits)+",";
   p+="\"ask\":"+Num(tick.ask,(int)digits)+",";
   p+="\"last\":"+Num(tick.last,(int)digits)+",";
   p+="\"spread_points\":"+Num(spread,2)+",";
   p+="\"digits\":"+(string)digits+",";
   p+="\"point\":"+Num(point,10)+",";
   p+="\"session_day\":"+(string)TimeDayOfWeek(TimeCurrent())+",";
   p+="\"time_server\":\""+TimeToString(TimeCurrent(),TIME_DATE|TIME_SECONDS)+"\",";
   p+="\"timeframes\":{";
   p+="\"MN\":{"bars\":"+BarArray(PERIOD_MN1,InpBarsPerTF)+"},";
   p+="\"D1\":{"bars\":"+BarArray(PERIOD_D1,InpBarsPerTF)+"},";
   p+="\"H4\":{"bars\":"+BarArray(PERIOD_H4,InpBarsPerTF)+"},";
   p+="\"M30\":{"bars\":"+BarArray(PERIOD_M30,InpBarsPerTF)+"},";
   p+="\"M15\":{"bars\":"+BarArray(PERIOD_M15,InpBarsPerTF)+"},";
   p+="\"M5\":{"bars\":"+BarArray(PERIOD_M5,InpBarsPerTF)+"}";
   p+="}}";
   p+="}";
   return p;
}

bool SendSnapshot()
{
   string payload=BuildPayload();
   if(payload=="") return false;

   string headers="Content-Type: application/json\r\nX-IRENX-Key: "+InpApiKey+"\r\nX-IRENX-Source: MT5\r\n";
   char data[],result[];
   StringToCharArray(payload,data,0,StringLen(payload),CP_UTF8);
   ArrayResize(data,ArraySize(data)-1);

   string response_headers;
   ResetLastError();
   int code=WebRequest("POST",InpEndpoint,headers,10000,data,result,response_headers);
   if(code==-1)
   {
      int err=GetLastError();
      Print("IRENX WebRequest failed. Error=",err,". Add endpoint domain under Tools > Options > Expert Advisors > Allow WebRequest.");
      if(InpShowPanel) Comment("IRENX PRIME\nWEBREQUEST ERROR: ",(string)err);
      return false;
   }

   string body=CharArrayToString(result,0,-1,CP_UTF8);
   Print("IRENX HTTP ",code," | ",body);
   if(InpShowPanel) ShowSignal(body,code);
   return (code>=200 && code<300);
}

int OnInit()
{
   g_symbol=(InpSymbol=="" ? _Symbol : InpSymbol);
   if(!SymbolSelect(g_symbol,true))
   {
      Print("IRENX: unable to select symbol ",g_symbol);
      return INIT_FAILED;
   }
   EventSetTimer(MathMax(1,InpIntervalSec));
   Print("IRENX Live Data Adapter started: ",g_symbol);
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   EventKillTimer();
   Comment("");
}

void OnTick()
{
   if(!InpSendOnNewBar) return;
   datetime bar=iTime(g_symbol,PERIOD_M5,0);
   if(bar>0 && bar!=g_last_bar_m5)
   {
      g_last_bar_m5=bar;
      if(SendSnapshot()) g_last_sent=TimeCurrent();
   }
}

void OnTimer()
{
   if(InpSendOnNewBar) return;
   if(TimeCurrent()-g_last_sent>=InpIntervalSec)
   {
      if(SendSnapshot()) g_last_sent=TimeCurrent();
   }
}
//+------------------------------------------------------------------+
