using HISWebApi.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;
using static HISWebApi.Models.IPDBO;

namespace MediSoftTech_HIS.App_Start
{
    public class APIProxy
    {
        public static string Baseurl = ConfigurationManager.AppSettings["APIHostPath"].ToString();
        public static string PharmacyBaseurl = ConfigurationManager.AppSettings["PharmacyAPIHostPath"].ToString();
        public static dataSet CallWebApiMethod(string methodRoute,Object obj)
        {
            dataSet ds = new dataSet();
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(Baseurl);
                    HttpResponseMessage response =client.PostAsJsonAsync("api/"+ methodRoute + "", obj).Result;
                    if(response.IsSuccessStatusCode)
                    {
                        string response_data=response.Content.ReadAsStringAsync().Result;
                        ds=JsonConvert.DeserializeObject<dataSet>(response_data, new JsonSerializerSettings
                        {
                            NullValueHandling = NullValueHandling.Ignore,
                            MissingMemberHandling = MissingMemberHandling.Ignore,
                            Formatting = Formatting.None,
                            DateFormatHandling = DateFormatHandling.IsoDateFormat,
                            FloatParseHandling = FloatParseHandling.Decimal
                        });
                    }
                }
                catch (Exception ex) { ds.ResultSet = null;ds.Msg = ex.Message; }
            }
            return ds;
        }
        public static dataSetPharmacy CallPharmacyWebApiMethod(string methodRoute, Object obj)
        {
            dataSetPharmacy ds = new dataSetPharmacy();
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(PharmacyBaseurl);
                    HttpResponseMessage response = client.PostAsJsonAsync("api/" + methodRoute + "", obj).Result;
                    if (response.IsSuccessStatusCode)
                    {
                        string response_data = response.Content.ReadAsStringAsync().Result;
                        ds = JsonConvert.DeserializeObject<dataSetPharmacy>(response_data, new JsonSerializerSettings
                        {
                            NullValueHandling = NullValueHandling.Ignore,
                            MissingMemberHandling = MissingMemberHandling.Ignore,
                            Formatting = Formatting.None,
                            DateFormatHandling = DateFormatHandling.IsoDateFormat,
                            FloatParseHandling = FloatParseHandling.Decimal
                        });
                    }
                }
                catch (Exception ex) { ds.result = null; ds.Msg = ex.Message; }
            }
            return ds;
        }

    }
}