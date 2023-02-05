using System;

namespace MSGraphAPITransferNote.Models
{
    public class WhatIfModel { 
        public string Description { get; set; }

        public string Uri { get; set; }

        public string HttpMethod { get; set; }

        public string TargetWorkloadId { get; set; }
    }
}