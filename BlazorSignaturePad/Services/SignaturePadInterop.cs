using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.JSInterop;
using BlazorSignaturePad.Models;
using static Dapper.SqlMapper;
using System.Text.Json;

namespace BlazorSignaturePad.Services
{
    public class SignaturePadInterop
    {
        private readonly IJSRuntime _JSRuntime;

        public SignaturePadInterop(IJSRuntime jsRuntime)
        {
            _JSRuntime = jsRuntime;
        }

        public async Task<string> RequestSignatureData()
        {
            var result = await _JSRuntime.InvokeAsync<JsonElement>("SignaturePad.RequestDrawingData");
            if (result.GetArrayLength()>0)
            {
                return result.ToString();
            }
            return null;
        }

        public async Task ChangeSettings(SignaturePadSettings settings)
        {
            await _JSRuntime.InvokeVoidAsync("SignaturePad.ChangeSettings", settings);
        }

        /// <summary>
        /// Lock or Unlock the signature pad from editing
        /// </summary>
        /// <param name="lockEnabled"></param>
        /// <returns></returns>
        public async Task LockUnlockSignaturePad(bool lockEnabled)
        {
            await _JSRuntime.InvokeVoidAsync("SignaturePad.LockSignaturePad", lockEnabled);
        }

        public async Task ClearSignaturePad()
        {
            await _JSRuntime.InvokeVoidAsync("SignaturePad.ClearSignaturePad");
        }
          
        public async Task DrawFromJson(string jsonString, bool clearExistingData)
        {
            try
            {
                var d = JsonSerializer.Deserialize<double[][]>(jsonString);
                await _JSRuntime.InvokeVoidAsync("SignaturePad.DrawFromPointsArray", d, clearExistingData);
            }
            catch (JsonException ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public enum ImageType
        {
            png,
            jpg,
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="pixelRatio">Increase the base size to increase quality</param>
        /// <param name="typeOfImageRequested">jpg or png</param>
        /// <param name="jpgImageQuality">if jpg is requested, supply a quality value from 0 to 1, 0 is the lowest quality.</param>
        /// <returns></returns>
        public async Task<string> RequestDiagramAsImage(int pixelRatio = 1, ImageType typeOfImageRequested = ImageType.png, double jpgImageQuality = 0.0, bool stripImgTags = true)
        {
            var imageType = typeOfImageRequested == ImageType.png ? "image/png" : "image/jpeg";
            var result = await _JSRuntime.InvokeAsync<string>("SignaturePad.RequestAsImage", imageType, pixelRatio, jpgImageQuality);
            return (stripImgTags ? result.Split(",")[1] : result);
        }

    }
}
