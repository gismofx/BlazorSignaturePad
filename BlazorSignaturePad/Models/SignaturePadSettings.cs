using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorSignaturePad.Models
{
    public class SignaturePadSettings
    {
        public string ContainerName { get; set; } = "container1";
        public int? StagePixelWidth { get; set; } = null;
        public int? StagePixelHeight { get; set; } = null;
        public int? StrokeWidth { get; set; } = null;
        public string StrokeColor { get; set; } = null;
        public bool IsLocked { get; set; } = false;
        public int? Ratio { get; set; } = null;

    }
}
