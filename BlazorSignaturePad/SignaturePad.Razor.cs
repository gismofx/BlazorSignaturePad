using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using BlazorSignaturePad.Models;
using BlazorSignaturePad.Services;

namespace BlazorSignaturePad
{
    public partial class SignaturePad : ComponentBase, IDisposable
    {
        private DotNetObjectReference<SignaturePad> _ObjectReference;

        [Inject]
        public IJSRuntime jsRuntime { get; set; }

        [Parameter]
        public SignaturePadSettings Settings { get; set; } = null;

        [Parameter]
        public bool LockFromEditing { get; set; } = false;



        [EditorBrowsable(EditorBrowsableState.Never)]
        public override async Task SetParametersAsync(ParameterView parameters)
        {
            var lockFromEditing = parameters.GetValueOrDefault<bool>("LockFromEditing");
            if (!LockFromEditing.Equals(LockFromEditing))
            {
                LockFromEditing = lockFromEditing;
                //_OnParameterChangeEvents.Enqueue(InitDamageDiagram());
            }

            var padSettings = parameters.GetValueOrDefault<SignaturePadSettings>("Settings");
            if (padSettings is not null)
            {
                Settings = padSettings;
                //if (_OnParameterChangeEvents.Count == 0)
                //{
                //    _OnParameterChangeEvents.Enqueue(InitDamageDiagram());
                //}
            }
            else
            {
                Settings = new SignaturePadSettings();
            }

            //Events
            await base.SetParametersAsync(ParameterView.Empty);

        }

        //protected override async Task OnParametersSetAsync()
        //{
        //    if (IsInitialized is true)
        //    {
        //        while (_OnParameterChangeEvents.Count > 0)
        //        {
        //            try
        //            {
        //                await _OnParameterChangeEvents.Dequeue();
        //            }
        //            catch (NullReferenceException ex)
        //            {
        //                //do nothing
        //            }
        //        }
        //    }
        //    else
        //    {
        //        _OnParameterChangeEvents.Clear();
        //    }
        //}


        private bool IsInitialized = false;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                await InitSignaturePad();
                IsInitialized = true;
            }
        }

        private async Task InitSignaturePad()
        {
            await jsRuntime.InvokeVoidAsync("SignaturePad.InitSignaturePad", _ObjectReference, Settings, null);
        }

        protected override void OnInitialized()
        {
            _ObjectReference = DotNetObjectReference.Create(this);
        }

        /// <summary>
        /// Since there is no subsequent rendering required by blazor after the first render, this set to false
        /// </summary>
        /// <returns></returns>
        protected override bool ShouldRender()
        {
            return false;
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            if (_ObjectReference != null)
            {
                //Now dispose our object reference so our component can be garbage collected
                _ObjectReference.Dispose();
            }

        }


    }
}
