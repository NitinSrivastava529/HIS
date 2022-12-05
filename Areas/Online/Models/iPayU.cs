using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MediSoftTech_HIS.Areas.Online.Models
{
    public class ipPayU
    {
        public string Key { get; set; }
        public string TnxId { get; set; }
        public string Hash { get; set; }
        public string Amount { get; set; }
        public string firstname { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Remark { get; set; }
        public string DoctorName { get; set; }
        public string app_date { get; set; }
        
        public string UDF { get; set; }
        public string Salt { get; set; }
        public string surl { get; set; }
        public string furl { get; set; }
        public string Message { get; set; }
    }
}