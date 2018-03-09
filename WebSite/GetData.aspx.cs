using System;
using System.Net;
using System.IO;

public partial class _GetData : System.Web.UI.Page 
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack) {

            SendImg();
        }
    }
    public void SendImg() {

     string page=Request.QueryString["page"];
     if (page != null) {
         string List = GetHttpData("http://www.wookmark.com/api/json/popular?page="+page+"");
         Response.Write(List);
     }
    //http://www.wookmark.com/api/json/popular?page=1
    }
    public string GetHttpData(string Url)
    {
        string sException = null;
        string sRslt = null;
        WebResponse oWebRps = null;
        WebRequest oWebRqst = WebRequest.Create(Url);
        oWebRqst.Timeout = 50000;
        try
        {
            oWebRps = oWebRqst.GetResponse();
        }
        catch (WebException e)
        {
            sException = e.Message.ToString();
            Response.Write(sException);
        }
        catch (Exception e)
        {
            sException = e.ToString();
            Response.Write(sException);
        }
        finally
        {
            if (oWebRps != null)
            {
                StreamReader oStreamRd = new StreamReader(oWebRps.GetResponseStream(), System.Text.Encoding.GetEncoding("GB2312"));
                sRslt = oStreamRd.ReadToEnd();
                oStreamRd.Close();
                oWebRps.Close();
            }
        }
        return sRslt;
    }
}
