// if (window.self === window.top) {
//     document.body.innerText = 'This application is for use in the Salesforce Marketing Cloud Content Builder only!';;
// }

let sdk = new window.sfdc.BlockSDK(); //initalize SDK



let mapData = {
    field: '',
    team: '',
    id: '',
    team1: '',
    team2: '',
    startTime: '',
    leagueInfo: '',
    leagueid: '',
    bet1Link: '',
    betXLink: '',
    bet2Link: '',
    baseUrl: '',
    tip1id: '',
    tipXid: '',
    tip2id: '',
    sportid: ''
};


let defaultContent = '<img id="defaultImage" src="https://image.s10.sfmc-content.com/lib/fe3b15707564047a7d1573/m/1/59a1e816-d94f-4672-888c-018b41d8db52.jpg" style="display:block;width:255px;float:left;"><p style="padding-top:10px;"><b>Name</b><br><i>Description</i><br><br><span style="font-size:18px;font-weight:bold;">Price</span><br><span style="background-color:#00a1f4; border: 10px solid #00a1f4; color:#ffffff; font-size:16px;margin-top:10px;display:inline-block;">Button</span></p>';

let saveData = () => {
    console.log('Saving data...');

    mapData.field = $('#field').text();
    mapData.team = $('#team').text();
    mapData.id = $('#id').text();
    mapData.team1 = $('#team1').text();
    mapData.team2 = $('#team2').text();
    mapData.startTime = $('#startTime').text();
    mapData.leagueInfo = $('#leagueInfo').text();
    mapData.leagueid = $('#leagueid').text();
    mapData.bet1Link = $('#bet1Link').text();
    mapData.betXLink = $('#betXLink').text();
    mapData.bet2Link = $('#bet2Link').text();
    mapData.baseUrl = $('#baseUrl').text();
    mapData.tip1id = $('#tip1id').text();
    mapData.tipXid = $('#tipXid').text();
    mapData.tip2id = $('#tip2id').text();
    mapData.sportid = $('#sportid').text();

    
    sdk.setData(mapData, (data) => {
        // mapData = data;
        let content = `<tr>
  <td align="center" valign="top" >
    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <!-- added padding here -->
        <td>
         field: ${mapData.field} <br />
         team: ${mapData.team}<br />
         id: ${mapData.id}<br />
         team1: ${mapData.team1}<br />
         team2: ${mapData.team2}<br />
         startTime: ${mapData.startTime}<br />
         leagueInfo: ${mapData.leagueInfo}<br />
         leagueid: ${mapData.leagueid}<br />
         bet1Link: ${mapData.bet1Link}<br />
         betXLink: ${mapData.betXLink}<br />
         bet2Link: ${mapData.bet2Link}<br />
         baseUrl: ${mapData.baseUrl}<br />
         tip1id: ${mapData.tip1id}<br />
         tipXid: ${mapData.tipXid}<br />
         tip2id: ${mapData.tip2id}<br />
         sportid: ${mapData.sportid}
        </td>
      </tr>
    </table>
  </td>
</tr>`;
        let superContent = defaultContent;


        //check for ampscript
        if (content.search('%%') === -1) {
            superContent = content;
        }

        console.log('content: ' + content);

        sdk.setSuperContent(superContent), (newSuperContent) => {};
        sdk.setContent(content);

    });

    console.log(JSON.stringify(mapData));

}

let fetchData = () => {

    console.log('Loading data...');

    sdk.getData((data) => {
        if (Object.keys(data).length > 0) {
            mapData = data;

            document.getElementById('sku').value = mapData.sku;
            console.log('Found data!');
        }
    });

    console.log(JSON.stringify(mapData));
}

window.onload = fetchData;
window.onchange = saveData;