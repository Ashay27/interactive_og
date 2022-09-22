import React from 'react';
import '../App.css';

export default function InfoModalContent() {

  return(
    <> 
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <ul>
            <li> All values are in meters </li>
            <li> Use point ( . ) for decimal values not comma ( , ) </li>
          </ul>
        </li>
        <li class="list-group-item">
          <b>Steps to use the tool</b>
          <ol>
            <li>
              <b>3D background: </b> Default 3D model in background is Haaksbergweg profile, to change it click on the Upload 3D Model button and select a 3D file (gltf, glb, obj) from your computer. File size should be max 50 MB.
            </li>
          
            <li>
              <b>Ground level and street boundaries: </b>
              To set the ground level and street boundaries, user should get the exact values from the 3D model of street.
                <ol>
                  <li class="lower-alpha">Start by double-clicking on the horizontal line and set the ground level (in meters)</li>
                  <li class="lower-alpha">Double-click on the left vertical line (dark blue in color) and set it to the left end of the street. (in meters)</li>
                  <li class="lower-alpha">Double-click on the right vertical line (light blue in color) and set it to the right end of the street. (in meters)</li>
                  <li class="lower-alpha">Note: Street width is the value of the right vertical line minus the left vertical line</li>
                </ol>
            </li>
          
            <li>
              <b>Adding assets: </b>
              The different assets can be added to the street profile in the following manner.
              <ol>
                  <li class="lower-alpha">Click on the button “Add asset”</li>
                  <li class="lower-alpha">Choose the asset type</li>
                  <li class="lower-alpha">Recommended diameter from the uitlegschema is shown for the asset. Set the Diameter of the asset. This value can be changed as choice</li>
                  <li class="lower-alpha">Recommended Depth of the asset is shown in a placeholder. You still need to enter the value. The depth is the 3D Model is from the horizontal line to the top edge of the asset.</li>
                  <li class="lower-alpha">Enter the distance of the asset from the left vertical line. In 3D model, this is shown from the left vertical line to the center of the added asset.</li>
                  <li class="lower-alpha">Click on "Upload Asset" button to upload the asset.</li>
                  <li class="lower-alpha">Add all the assets for the profile in a similar manner.</li>                
                </ol>
            </li>

            <li>
              <b>Legend: </b>
                <p>* transp means transport <br/>
                   * dist means distribution
                </p>
              <ul>
                  <li >CAI/T - CAI/ TV/ Telecom (transp)</li>
                  <li >Data - Glasvezel (dist)</li>
                  <li >E (LS) - Electra Laagspanning (dist)</li>
                  <li >E (MS)_t - Electra Middenspanning (transp)</li>
                  <li >E (MS)_d - Electra Middenspanning (dist)</li>
                  <li >E (HS) - Electra Hoogspanning (transp)</li>
                  <li >DWA_t - DWA Droogweerafvoer (onderheid riool) (transp)</li>
                  <li >DWA_d - DWA Droogweerafvoer (riool) (dist)</li>
                  <li >DWA+RWA (gemengd)_t - DWA+RWA (gemengd) Droogweerafvoer (onderheid riool) (transp)</li>
                  <li >DWA+RWA (gemengd)_d - DWA+RWA (gemengd) Droogweerafvoer (riool) (dist)</li>
                  <li >HWA/ RWA - Hemelwaterafvoer (riool) (dist)</li>
                  <li >PL - Persleiding (transp)</li>
                  <li >Warmte_HT - Warmtenet Hoogtemperatuur (HT) (transp)</li>
                  <li >Warmte_MT - Warmtenet Midden temperatuur (MT) (dist)</li>
                  <li >Warmte LT - Warmtenet Lage Temperatuur (dist)</li>
                  <li >Koude - Koude (Warmtenet Lage Temperatuur (dist)) </li>
                  <li >Datawarmte - Datawarmte (Warmtenet Lage Temperatuur (dist))</li>
                  <li >W_t - Drinkwater (transp)</li>
                  <li >W_d - Drinkwater (dist)</li>
                  <li >G_t - Gas (transp)</li>
                  <li >G_d - Gas (dist)</li>
                  <li >O.A.T. - Ondergronds Afval Transport (transp)</li>
                  <li >Boom 1 - Tree height more than 15 meters</li>
                  <li >Boom 2 - Tree height between 10 and 15 meters</li>
                  <li >Boom 3 - Tree height between 6 to 10 meters</li>
                  <li >Gebouwen</li>
                </ul>
            </li>
            <li>
              <b>Conflict detection: </b>To check for conflicts in the profile, you need to check the conflicts for each asset. 
              <ol>
              <li class="lower-alpha">Left click on an asset to see the conflicts for the asset</li>
              <li class="lower-alpha">The selected asset is in yellow color</li>
              <li class="lower-alpha">The conflicted assets are shown in red color</li>
              <li class="lower-alpha">On the top right, the name of the assets that conflict are shown upon clicking an asset.</li>
              </ol>
            </li>
          
            <li>
              <b>Update diameter and depth: </b>To change the diameter or depth of the asset, right click on the asset and change the respective values.
            </li>
          
            <li>
              <b>Drag and drop: </b>To change the position (distance) of the asset, drag (left click and hold the mouse button) the asset and drop it in a desired position. 
            </li>
          
            <li>
              <b>Delete asset: </b>To remove an asset from the profile, right-click on the asset and choose “Delete Asset” 
            </li>
          
            <li>
              <b>Asset Details: </b>To see a list of all the assets (existing or deleted), click on the “Asset Details” button. 
            </li>
          
            <li>
              <b>Restore asset: </b>A deleted asset can be seen at the bottom of the list upon clicking on “Asset Details”. To restore the asset, click on “Restore Asset” button. Once you restore an asset, the asset will reappear in the 3D model based on the previous data (diameter, depth, distance) 
            </li>
          
            <li>
              <b>Grid: </b>Click on “View Grid” button to see the grid in the model. Each grid is 0.5 meter size and can be used to estimate the length in the profile. 
            </li>

            <li>
              <b>Reset profile: </b>Use the "Clear all" button to reset the profile and remove all the added assets, reset the ground level, street boundaries and view settings. Once cleared, any data cannot be restored. 
            </li>
          
          </ol>
        
        </li>
        <li class="list-group-item">
          <b>Different views</b>
          <ol>
            <li>To enable rotation of the view, click on “View rotation button”. Left click the mouse button and move around to rotate. You can right click on the mouse and drag to move around in the 3D model, in x or y axis.</li>
            <li>To save the view settings, click “Alt + R”.</li>
            <li>Choose the different views to select the Front View, Top View or Perspective View button.</li>
            <li>The saved view settings are reflected in Perspective View.</li>
          </ol>
        </li>        
        <li class="list-group-item">
          <b>Export Model</b>
          <p>Click on Export 3D Model button to save a copy of the profile in your computer. This is saved in GLTF format. To convert to GLTF to DXF format or vice-a-versa, use Blender Add-on <a href='https://all3dp.com/2/stl-to-dxf-how-to-convert-stl-files-to-dxf-autocad/'>( Link )</a></p>
        </li>
        <li class="list-group-item">
          <b>Transfer profile to another computer or browser</b>
          <ol>
            <li>On a browser where a profile is built, choose “Download/Upload” button.</li>
            <li>Next, click on “Download” and copy the data shown in the textbox.</li>
            <li>Go to another browser or computer, open the web-app. Again, choose the “Download/Upload” button.</li>
            <li>Paste the copied data to the empty textbox and click “Upload”.</li>
            <li>The profile is transferred to the new computer/browser.</li>
          </ol>
        </li>
        <li class="list-group-item">
          <b>Contact at</b>
          <p> integraleontwerpmthodeOR@amsterdam.nl </p>
        </li>
        <li class="list-group-item">
          <b>License - EUPL v1.2</b>
          <p>Find the License at <a href = "https://github.com/IOOR-GAdam/interactive_og/blob/main/LICENSE.txt"> GitHub  </a> </p>
        </li>
      </ul>
    </>
)

}
